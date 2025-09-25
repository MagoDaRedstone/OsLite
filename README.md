![OsLite](https://github.com/MagoDaRedstone/OsLite/blob/main/OsLite.png)

OsLite: Sistema Operacional no YouTube

Este projeto, chamado OsLite, é um sistema operacional educacional e leve desenvolvido para rodar diretamente dentro do player de vídeo do YouTube, usando a extensão Enhancer for YouTube do Firefox.

Aviso: Este projeto tem fins estritamente educacionais e de demonstração. Ele foi criado para explorar as capacidades de manipulação de páginas web com JavaScript. Ele não tem a intenção de ser uma ferramenta para hackear ou causar danos.

Como o Projeto Funciona

O OsLite foi concebido como um script JavaScript que se injeta na página do YouTube através da funcionalidade de "código personalizado" da extensão Enhancer for YouTube.

Ao ser injetado, o script faz o seguinte:

    Ele detecta o player de vídeo do YouTube e, ao clicar em um botão personalizado "Toggle Sistema", oculta o player.

    Em seguida, ele cria uma interface de "sistema operacional" sobre a página, completa com uma tela de inicialização, login e uma área de trabalho simples.

    A área de trabalho inclui aplicativos básicos como:

        Calculadora: Uma calculadora funcional usando a função eval().

        Bloco de Notas: Uma área de texto simples para anotações.

        Calendário: Mostra a data atual.

        Doom 3D: Uma demonstração de um jogo de "Raycasting", simulando o estilo de jogos 3D antigos como o Doom, usando o elemento <canvas> para renderização.

        Minecraft 3D: Uma demonstração de um ambiente 3D simples, renderizado com WebGL, onde você pode se mover com a câmera.

A ideia por trás do OsLite é mostrar como é possível criar interfaces e até mesmo jogos 3D complexos usando apenas tecnologias web (HTML, CSS e JavaScript), manipulando o DOM de uma página existente.

Como Executar o OsLite

Para rodar este projeto, você precisará da extensão Enhancer for YouTube no seu navegador Firefox.

Passo 1: Instale a Extensão

    Abra o Firefox.

    Vá para a página da extensão Enhancer for YouTube e instale-a.

Passo 2: Adicione o Código

    Vá para qualquer vídeo no YouTube.

    Clique no ícone da extensão Enhancer for YouTube.

    Nas configurações da extensão, procure por "Código Personalizado" ou uma opção similar para inserir um script.

    Copie todo o conteúdo do arquivo System.js deste repositório e cole-o na área de código.

    Salve as configurações.

Passo 3: Inicie o OsLite

    Recarregue a página do YouTube.

    Um botão com o texto "Toggle Sistema" deve aparecer no canto superior esquerdo da tela.

    Clique no botão para iniciar e alternar entre o player de vídeo e o seu novo "sistema operacional" OsLite.

O arquivo System.js está bem comentado para facilitar o entendimento. As principais seções do código são:

    getMoviePlayer(): Função que localiza o player do YouTube de diversas formas.

    waitForMoviePlayer(): Garante que o script espere até que o player seja carregado antes de tentar interagir com ele.

    showMessage(): Uma função auxiliar para mostrar mensagens de notificação na tela.

    button.addEventListener('click', ...): O controlador principal que oculta o player e inicia a interface do OsLite.

    Funções de Tela: Funções como startScreen(), loginScreen(), desktopScreen() que constroem as diferentes partes da interface do sistema.

    Doom 3D e Minecraft 3D: Demonstrações dos jogos, onde o Doom usa renderização 2D em um loop de raycasting e o Minecraft usa WebGL para renderizar cubos 3D de verdade.

Sinta-se à vontade para explorar e modificar o código para fins de aprendizado!
