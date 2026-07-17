# Colónia de Cagarros

Aplicação web simples e instalável para simular uma colónia de cagarros durante atividades educativas e registar automaticamente o número de participantes.

## Como funciona

1. Cada aluno toca uma vez em **Adicionar um cagarro**.
2. Cada toque aumenta simultaneamente o número de cagarros e o número de participantes da atividade em curso.
3. O professor também pode introduzir manualmente o total de alunos presentes. O valor definido substitui o contador atual e não é somado novamente.
4. O registo é atualizado automaticamente após cada toque ou alteração manual, sem ser necessário guardar a atividade.
5. Ao tocar em **Ouvir a colónia**, a aplicação reproduz uma vocalização por participante.
6. As vozes começam com pequenos atrasos, variações de intensidade, posição estéreo e velocidade, criando sobreposição sem soarem exatamente iguais.
7. O botão **Nova atividade e reiniciar contador** mantém a atividade anterior nas estatísticas e inicia uma nova sessão a zero.

O limite foi definido em 60 vocalizações simultâneas para proteger o desempenho e o volume do tablet.

## Estatísticas

O botão **Estatísticas** apresenta:

- total acumulado de participantes;
- número de atividades realizadas;
- média de participantes por atividade;
- histórico com data e hora;
- filtros por mês e ano;
- identificação da atividade que ainda está em curso.

Os dados ficam guardados localmente no navegador do tablet através do armazenamento da aplicação. Continuam disponíveis sem internet, mas não são sincronizados automaticamente com outros dispositivos.

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub, por exemplo `colonia-cagarros`.
2. Carregue todo o conteúdo desta pasta para a raiz do repositório.
3. No GitHub, abra **Settings > Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/(root)`, depois guarde.
6. Abra o endereço disponibilizado pelo GitHub Pages no Chrome do tablet.
7. Use **Adicionar ao ecrã principal** ou o botão de instalação apresentado na aplicação.

Depois da primeira abertura completa, o service worker guarda a aplicação e os sons para utilização sem internet.

## Testar localmente

A aplicação deve ser aberta através de um pequeno servidor web, não diretamente com duplo clique no ficheiro `index.html`.

Com Python instalado:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador.

## Estrutura

- `index.html`: interface
- `styles.css`: design responsivo
- `app.js`: contagem, estatísticas e motor de áudio
- `manifest.webmanifest`: instalação como aplicação
- `service-worker.js`: funcionamento offline
- `assets/audio/`: excertos de vocalizações
- `assets/icons/`: ícones da aplicação
- `CREDITS.md`: atribuições das gravações

## Nota sobre o áudio

Confirme as licenças individuais no Xeno-canto antes de distribuir publicamente a aplicação. Consulte `CREDITS.md`.
