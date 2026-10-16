"""
Document Parsers for RAG Ingestion Pipeline.
Handles PDF, DOCX, HTML, and SQL files, extracting text segments with rich page/section metadata.
"""
from typing import List, Dict, Any
import io
import re
from pathlib import Path
from bs4 import BeautifulSoup
import pypdf
import docx

class DocumentSegment:
    def __init__(self, content: str, source_file: str, section_or_page: str, metadata: Dict[str, Any] = None):
        self.content = content.strip()
        self.source_file = source_file
        self.section_or_page = section_or_page
        self.metadata = metadata or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "content": self.content,
            "source_file": self.source_file,
            "section_or_page": self.section_or_page,
            "metadata": self.metadata,
        }

def parse_pdf(file_bytes: bytes, filename: str) -> List[DocumentSegment]:
    """Extracts text page-by-page from a PDF file."""
    segments: List[DocumentSegment] = []
    reader = pypdf.PdfReader(io.BytesIO(file_bytes))
    
    for page_idx, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        text = re.sub(r'\s+', ' ', text).strip()
        if text:
            segments.append(
                DocumentSegment(
                    content=text,
                    source_file=filename,
                    section_or_page=f"Page {page_idx + 1}",
                    metadata={"total_pages": len(reader.pages), "page": page_idx + 1}
                )
            )
    return segments

def parse_docx(file_bytes: bytes, filename: str) -> List[DocumentSegment]:
    """Extracts paragraphs and tables from a DOCX file, preserving structure."""
    segments: List[DocumentSegment] = []
    doc = docx.Document(io.BytesIO(file_bytes))
    
    current_section = "General"
    buffer: List[str] = []
    
    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue
        # Detect headings as section delimiters
        if para.style.name.startswith("Heading"):
            if buffer:
                segments.append(
                    DocumentSegment(
                        content=" ".join(buffer),
                        source_file=filename,
                        section_or_page=f"Section: {current_section}"
                    )
                )
                buffer = []
            current_section = text
        else:
            buffer.append(text)
            
    if buffer:
        segments.append(
            DocumentSegment(
                content=" ".join(buffer),
                source_file=filename,
                section_or_page=f"Section: {current_section}"
            )
        )
        
    # Extract tables
    for table_idx, table in enumerate(doc.tables):
        rows_text = []
        for row in table.rows:
            cell_texts = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if cell_texts:
                rows_text.append(" | ".join(cell_texts))
        if rows_text:
            segments.append(
                DocumentSegment(
                    content="\n".join(rows_text),
                    source_file=filename,
                    section_or_page=f"Table {table_idx + 1}"
                )
            )
            
    return segments

def parse_html(file_bytes: bytes, filename: str) -> List[DocumentSegment]:
    """Extracts cleaned content and structural headings from HTML files."""
    segments: List[DocumentSegment] = []
    html_text = file_bytes.decode("utf-8", errors="ignore")
    soup = BeautifulSoup(html_text, "html.parser")
    
    # Remove script and style elements
    for script_or_style in soup(["script", "style", "noscript", "svg"]):
        script_or_style.decompose()
        
    # Split by major headers (h1, h2, h3, article, section)
    headers = soup.find_all(["h1", "h2", "h3"])
    if not headers:
        text = " ".join(soup.stripped_strings)
        if text:
            segments.append(DocumentSegment(content=text, source_file=filename, section_or_page="Body"))
        return segments

    for h in headers:
        section_title = h.get_text(strip=True)
        # Collect siblings until next header
        content_parts = []
        curr = h.next_sibling
        while curr:
            if getattr(curr, 'name', None) in ["h1", "h2", "h3"]:
                break
            if hasattr(curr, 'get_text'):
                txt = curr.get_text(strip=True)
                if txt:
                    content_parts.append(txt)
            curr = curr.next_sibling
            
        full_section_text = f"{section_title}: " + " ".join(content_parts)
        if len(full_section_text.strip()) > 20:
            segments.append(
                DocumentSegment(
                    content=full_section_text,
                    source_file=filename,
                    section_or_page=f"Heading: {section_title}"
                )
            )
            
    return segments

def parse_sql(file_bytes: bytes, filename: str) -> List[DocumentSegment]:
    """Extracts schema CREATE statements, table comments, and seed queries from SQL dumps."""
    segments: List[DocumentSegment] = []
    sql_text = file_bytes.decode("utf-8", errors="ignore")
    
    # Split by CREATE TABLE statements or significant statement boundaries
    table_blocks = re.split(r'(?i)(?=CREATE\s+TABLE)', sql_text)
    
    for block_idx, block in enumerate(table_blocks):
        clean_block = block.strip()
        if not clean_block:
            continue
        # Extract table name if present
        table_name_match = re.search(r'(?i)CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([`"\[]?\w+[`"\]]?)', clean_block)
        section = f"Table {table_name_match.group(1)}" if table_name_match else f"Query Block {block_idx + 1}"
        
        segments.append(
            DocumentSegment(
                content=clean_block[:2000],  # Bound size
                source_file=filename,
                section_or_page=section,
                metadata={"type": "sql_ddl_or_query"}
            )
        )
    return segments

def parse_document(file_bytes: bytes, filename: str) -> List[DocumentSegment]:
    """Universal parser router determining extraction based on file extension."""
    ext = Path(filename).suffix.lower()
    if ext == ".pdf":
        return parse_pdf(file_bytes, filename)
    elif ext in (".docx", ".doc"):
        return parse_docx(file_bytes, filename)
    elif ext in (".html", ".htm"):
        return parse_html(file_bytes, filename)
    elif ext in (".sql",):
        return parse_sql(file_bytes, filename)
    elif ext in (".txt", ".md", ".json", ".csv"):
        text = file_bytes.decode("utf-8", errors="ignore")
        return [DocumentSegment(content=text, source_file=filename, section_or_page="Full Text")]
    else:
        # Fallback raw text decoding
        text = file_bytes.decode("utf-8", errors="ignore")
        return [DocumentSegment(content=text, source_file=filename, section_or_page="Raw Content")]
