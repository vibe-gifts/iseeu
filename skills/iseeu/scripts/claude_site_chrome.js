// Claude do site (claude.ai): roda no Chrome logado, numa aba nova em https://claude.ai.
// Troque INICIO e FIM (horário UTC: o dia D de Brasília vai de D T03:00 a D+1 T03:00) e NOME.
// Baixa um JSON só com as mensagens dele, no formato que extrair_claude_export.py lê, e devolve a lista.
// O Chrome bloqueia o segundo download na mesma aba: para outro download, abra outra aba.
const ini = 'INICIO', fim = 'FIM', R = [];
for (const o of await fetch('/api/organizations').then(r => r.json())) {
  const cs = await fetch(`/api/organizations/${o.uuid}/chat_conversations?limit=200`).then(r => r.ok ? r.json() : []);
  for (const c of cs.filter(c => (c.updated_at || '') >= ini)) {
    const full = await fetch(`/api/organizations/${o.uuid}/chat_conversations/${c.uuid}?tree=False&rendering_mode=messages`).then(r => r.json());
    const msgs = (full.chat_messages || []).filter(m => m.sender === 'human' && m.created_at >= ini && m.created_at < fim)
      .map(m => ({sender: 'human', created_at: m.created_at, text: m.text || '', content: (m.content || []).filter(p => p.type === 'text').map(p => ({type: 'text', text: p.text}))}));
    if (msgs.length) R.push({uuid: c.uuid, name: c.name, chat_messages: msgs});
  }
}
if (R.length) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(R)], {type: 'application/json'}));
  a.download = 'NOME'; document.body.appendChild(a); a.click(); }
R.map(c => [c.name, c.chat_messages.length, c.chat_messages[0].created_at.slice(0,10)])
