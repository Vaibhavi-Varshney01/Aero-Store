/**
 * Embedded AI Chatbot Widget
 * Supports Natural Language Shopping Assistance and Developer Use Case Commands
 */

class ChatbotWidget {
  constructor() {
    this.isOpen = false;
    this.history = [];
    this.dom = {
      launcher: document.getElementById('chatbot-launcher'),
      window: document.getElementById('chat-window'),
      closeBtn: document.getElementById('btn-chat-close'),
      messagesFeed: document.getElementById('chat-messages-feed'),
      input: document.getElementById('chat-user-input'),
      sendBtn: document.getElementById('btn-chat-send'),
      chipsWrap: document.getElementById('chat-chips-wrap')
    };

    this.init();
  }

  init() {
    if (!this.dom.launcher) return;

    this.dom.launcher.addEventListener('click', () => this.toggleChat());
    this.dom.closeBtn.addEventListener('click', () => this.closeChat());
    this.dom.sendBtn.addEventListener('click', () => this.handleSend());
    this.dom.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSend();
      if (e.key === 'Escape') this.closeChat();
    });

    // Default chips
    this.renderChips(['Show products', 'Items under $100', 'View cart', 'Checkout', 'My orders', 'Active coupons', '/help']);

    // Welcome message
    this.appendMessage('bot', '👋 **Hello! I am your AeroStore AI Concierge & CRUD Assistant.**\n\nI can manage your cart, search diverse categories (Audio, Apparel, Fitness, Home & Living), apply coupons, place orders, and track deliveries! Type `/help` for all commands.');
  }

  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  openChat() {
    this.isOpen = true;
    this.dom.window.classList.add('open');
    this.dom.window.setAttribute('aria-hidden', 'false');
    this.dom.input.focus();
  }

  closeChat() {
    this.isOpen = false;
    this.dom.window.classList.remove('open');
    this.dom.window.setAttribute('aria-hidden', 'true');
    this.dom.launcher.focus();
  }

  async handleSend(customText = null) {
    const text = (customText || this.dom.input.value).trim();
    if (!text) return;

    this.dom.input.value = '';
    this.appendMessage('user', text);

    // Show typing placeholder
    const typingId = this.appendTypingIndicator();

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: this.history
        })
      });

      this.removeTypingIndicator(typingId);

      if (!res.ok) {
        this.appendMessage('bot', '⚠️ Sorry, I encountered an error communicating with the AI service.');
        return;
      }

      const data = await res.json();
      this.appendMessage('bot', data.reply);

      if (data.suggested_commands && data.suggested_commands.length) {
        this.renderChips(data.suggested_commands);
      }
    } catch (err) {
      this.removeTypingIndicator(typingId);
      this.appendMessage('bot', '⚠️ Network connection issue. Please check your connection.');
    }
  }

  appendMessage(role, text) {
    const row = document.createElement('div');
    row.className = `msg-row ${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = this.formatMarkdown(text);

    const time = document.createElement('span');
    time.className = 'msg-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    row.appendChild(bubble);
    row.appendChild(time);
    this.dom.messagesFeed.appendChild(row);
    this.dom.messagesFeed.scrollTop = this.dom.messagesFeed.scrollHeight;

    this.history.push({ role, content: text });
  }

  appendTypingIndicator() {
    const id = `typing-${Date.now()}`;
    const row = document.createElement('div');
    row.className = 'msg-row bot';
    row.id = id;
    row.innerHTML = `<div class="msg-bubble" style="opacity:0.7">Thinking...</div>`;
    this.dom.messagesFeed.appendChild(row);
    this.dom.messagesFeed.scrollTop = this.dom.messagesFeed.scrollHeight;
    return id;
  }

  removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  renderChips(chips) {
    this.dom.chipsWrap.innerHTML = '';
    chips.forEach(chipText => {
      const chip = document.createElement('button');
      chip.className = 'chat-chip';
      chip.textContent = chipText;
      chip.addEventListener('click', () => this.handleSend(chipText));
      this.dom.chipsWrap.appendChild(chip);
    });
  }

  formatMarkdown(text) {
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 5px;border-radius:4px;font-size:0.85em;color:#38bdf8;">$1</code>');
    // Bullet points
    formatted = formatted.replace(/^\s*•\s+(.*)/gm, '<li style="margin-left:1.2rem;">$1</li>');
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br/>');

    return formatted;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.chatbot = new ChatbotWidget();
});
