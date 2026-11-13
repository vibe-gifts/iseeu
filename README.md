# iseeu

**Um segundo cérebro que te conhece pelo que você faz, e um consultor que sabe te coordenar.**

Se lê "I see eu": eu me vejo. Em inglês e em português ao mesmo tempo, porque é isso que ele faz: te mostra quem você é pelos fatos.

Num teste de personalidade, você marca quem gostaria de ser. O iseeu faz diferente. Ele lê o que você **disse e fez**: suas conversas com IA, o seu WhatsApp, aulas, reuniões e áudios. Com isso, monta no Obsidian o mapa de como você pensa, fala, decide e se relaciona.

Depois, ele preenche seis testes de comportamento com provas tiradas da sua própria fala: Eneagrama, DISC, os 5 pilares da liderança, mindset, liderança situacional e "conhecendo um a um". Por fim, cria um consultor pessoal que sabe como você funciona.

## O que ele faz

- **Instala com você, passo a passo.** Pergunta onde estão as suas conversas e o que fica de fora. Explica como cada coisa chega:
  - o que está no computador, ele mesmo pega (Claude Code, Codex, WhatsApp do Mac);
  - o resto você exporta e solta numa pasta só, com o passo a passo de cada serviço (ChatGPT, Claude do site, WhatsApp do celular).
- **Organiza sozinho.** Cada conversa vira uma ficha. Cada ficha vira ideias, decisões, pessoas e projetos ligados entre si, sempre com a frase exata e o link para a fonte.
- **Escreve o seu diário.** Todo dia: onde a cabeça esteve, o que você decidiu, como estava o humor e o que ficou combinado.
- **Mostra quem você é, pelos fatos.** Os seis testes viram gráficos no topo do painel do Obsidian, cada um com a mudança que vale fazer.
- **Monta o seu consultor.** É um agente que lê o cérebro e o seu objetivo do mês, e diz o que fazer agora. Ele sabe o que funciona com você e o que não funciona.
- **Refaz tudo todo mês.** No dia 1, ele fecha o mês, refaz os testes e mostra no painel o mês anterior por baixo do atual. Assim você vê se melhorou.

## Instalação

**Claude Code:** na caixa de mensagem, digite:

```
/plugin marketplace add vibe-gifts/iseeu
/plugin install iseeu@iseeu
```

No app do Claude (aba Code), clique em **+** ao lado da caixa de mensagem, depois em **Plugins** e em **Add marketplace**. Informe `vibe-gifts/iseeu` e clique em **Add plugin**.

**Codex:** baixe este repositório (botão **Code** → **Download ZIP**) e descompacte. Depois diga ao Codex onde ficou a pasta `skills/iseeu`.

Depois de instalar, abra uma conversa e escreva:

> acabei de baixar, monta meu segundo cérebro

Ele conduz o resto.

## Do que você precisa

- O [Obsidian](https://obsidian.md), que é gratuito.
- Uma IA que grave arquivos no seu computador: o Claude Code ou o Codex. O ChatGPT do site ajuda a capturar, mas sozinho não organiza o cofre.
- Python 3, que já vem no Mac.

## Bom saber

- **Seus dados ficam no seu computador.** O cofre é uma pasta de arquivos de texto, e nada é enviado para servidor nosso. A única exceção é a IA que você usa: ela lê o texto para organizar, como em qualquer conversa.
- **Você escolhe o que entra.** Antes de puxar o WhatsApp, ele mostra a lista de conversas e você escolhe quais entram. Chaves e senhas que aparecerem são apagadas antes de entrar no cofre.
- **A primeira carga gasta bastante.** Meses de conversa são muito texto. Ele roda um teste de 2 dias, mostra o custo e só segue com o seu OK.
- **Partes só funcionam no Mac:** a leitura do WhatsApp do computador e a transcrição de áudio. No Windows, o WhatsApp entra pela exportação do celular.
- **Os testes são hipótese, não diagnóstico.** Cada nota vem com a prova. Se você discordar, a discordância também vira informação.

## Licença

MIT
