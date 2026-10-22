# -*- coding: utf-8 -*-
"""
Gera o site (réplica do andrealvesdesign.com) a partir dos dados abaixo.
Correr:  python build.py   (cria index.html, sobre-mim/ e projetos/)

Para mudar textos, ordem de imagens ou acrescentar um projeto, edita PROJECTS
e volta a correr. Cada linha da galeria (rows) é uma lista de peças lado a lado;
w/h são a largura/altura de cada peça no layout original (só a proporção importa).
"""
import os, html

ROOT = os.path.dirname(os.path.abspath(__file__))
import time
VERSION = time.strftime("%Y%m%d%H%M")   # muda a cada geração: obriga os browsers a carregar o CSS/JS novo
EMAIL = "andreralvesdesign@gmail.com"
# Envio do formulário de contacto SEM abrir o programa de email:
# cola aqui o endereço do teu formulário num serviço gratuito (ex.: Formspree -> "https://formspree.io/f/xxxxxxx").
# Enquanto estiver vazio, o botão "Enviar" abre o programa de email do visitante já com a mensagem preenchida.
CONTACT_ENDPOINT = "https://api.web3forms.com/submit"
# Se usares o Web3Forms: endereço "https://api.web3forms.com/submit" e aqui a tua chave de acesso (access key, enviada por email).
# A chave é pública por desenho, pode ficar no site. Com o Formspree deixa este campo vazio.
CONTACT_KEY = "8b20de56-e4b6-4457-b3f6-b414b2d31c4d"   # chave pública do Web3Forms (pode ficar no site)
LINKEDIN = "https://www.linkedin.com/in/andreralves2014/"
CV = "assets/curriculo/Curr%C3%ADculo%20-%20Andr%C3%A9%20Resende%20Alves.pdf"   # ficheiro em assets/curriculo (caminho relativo; ver {pre} no botão)

WIDE = (1223, 742)    # formato dos vídeos e das imagens grandes sozinhas (um pouco mais alto que 16:9; o vídeo é cortado ligeiramente nos lados)
# altura das linhas com duas imagens: igual à linha manual + cartão do Unlock (1223 x 553); muda também em css/style.css (.row-pair)
PAIR_ROW = (1223, 553)

def I(src, w, h, alt="", exact=False, vimeo=None): return {"t": "img", "src": src, "w": w, "h": h, "alt": alt, "exact": exact, "vimeo": vimeo}   # exact: mantém a proporção original (sem cortar), p.ex. ecrãs do curso
def V(src, w=1223, h=688, sync=None, exact=False): return {"t": "video", "src": src, "w": w, "h": h, "sync": sync, "exact": exact}   # sync: vídeos com o mesmo nome tocam sempre em sincronia

PROJECTS = [
  dict(slug="unlock-the-magic", hero_grain=18, hero_gradient=["#2d0101","#720101","#ef0101","#9c0001","#490101"], title="UNLOCK The Magic", cover="capas/unlock.webp",
    hero=I("unlock/hero.webp", 1425, 491),
    cat="BRANDING / EDIÇÃO DE VÍDEO / E-LEARNING", cat_en="BRANDING / VIDEO EDITING / E-LEARNING",
    date="NOVEMBRO 2025", date_en="NOVEMBER 2025",
    text="O UNLOCK The Magic foi uma formação interna desenvolvida para a Perfumes&amp;Companhia, com o objetivo de potenciar as competências de vendas e elevar a experiência de cliente nas lojas. Fui responsável pela criação da identidade visual da formação, desenvolvendo todo o seu universo gráfico. Assumi também a edição de todos os vídeos que integraram o curso.",
    text_en="UNLOCK The Magic was an internal training programme developed for Perfumes&amp;Companhia, aimed at boosting sales skills and raising the customer experience in stores. I was responsible for creating the programme's visual identity, developing its entire graphic universe. I also edited all the videos that made up the course.",
    rows=[
      [V("unlock/capa.mp4")],
      [I("unlock/manual.webp", 503, 553, "Manual Unlock The Magic"), I("unlock/cartao.webp", 709, 553, "Cartão Unlock The Magic")],
      [I("unlock/poster.webp", 1223, 742, "Poster Unlock The Magic")],
      [I("unlock/plataforma.webp", 1223, 742, "Plataforma e-learning")],
      [I("unlock/plataforma-video.webp", 1223, 742, "Plataforma e-learning, página de vídeo")],
      [V("unlock/apresentador.mp4", sync="antes-depois")],
      [V("unlock/aula.mp4", 606, 341, "antes-depois"), V("unlock/demo.mp4", 606, 341, "antes-depois")],
    ]),
  dict(slug="worten-wave", title="Worten Wave", cover="capas/wave.webp",
    hero=V("wave/header.mp4", 1425, 491),
    cat="BRANDING / EDIÇÃO DE VÍDEO / E-LEARNING", cat_en="BRANDING / VIDEO EDITING / E-LEARNING",
    date="JUNHO 2022", date_en="JUNE 2022",
    text="O Wave foi um programa de formação interna desenvolvido para a Worten, focado em elevar a experiência do cliente em loja. O projeto envolveu todos os colaboradores das lojas de Portugal e Espanha. A identidade visual foi desenvolvida em conjunto com a Abylos. A partir daí, assumi a responsabilidade total pela criação das peças gráficas, da plataforma e-learning e da edição dos vídeos formativos.",
    text_en="Wave was an internal training programme developed for Worten, focused on raising the in-store customer experience. The project involved every store employee in Portugal and Spain. The visual identity was developed together with Abylos. From there, I took full responsibility for creating the graphic pieces, the e-learning platform and editing the training videos.",
    rows=[
      [V("wave/laptop.mp4")],
      [I("wave/idcard.webp", 503, 553, "ID card Worten Wave"), I("wave/manual.webp", 709, 553, "Manual Worten Wave")],
      [V("wave/poster.mp4")],
      [I("wave/website.webp", 1223, 742, "Website Worten Wave")],
      [I("wave/foto1.webp", 606, 516, "Formação Worten Wave"), I("wave/foto2.webp", 606, 516, "Formação Worten Wave")],
      [V("wave/apresentadora.mp4", sync="antes-depois")],
      [V("wave/beatriz.mp4", 606, 341, "antes-depois"), V("wave/demo.mp4", 606, 341, "antes-depois")],
    ]),
  dict(slug="ribeira-palace", hero_focal=(50, 22), hero_grain=41, link="https://ribeirapalace.andrealvesdesign.com/", link_pt="Visualizar curso", link_en="View course", title="Ribeira Palace", cover="capas/ribeira.webp",
    hero=I("ribeira/hero.webp", 1425, 491),
    cat="DESIGN GRÁFICO / MULTIMÉDIA / E-LEARNING", cat_en="GRAPHIC DESIGN / MULTIMEDIA / E-LEARNING",
    date="OUTUBRO 2026", date_en="OCTOBER 2026",
    text="O Ribeira Palace foi uma formação e-learning, desenvolvida com o objetivo de apurar os conhecimentos do formando em boas práticas de atendimento na receção. Ao longo de quatro módulos, o formando assume o papel dos rececionistas Miguel e Marta em diferentes situações do dia a dia. Fui responsável pela idealização e conceção de todo o projeto, desde a identidade visual até à interface e à programação.",
    text_en="Ribeira Palace was an e-learning course, developed to assess the learner's knowledge of good customer service practices at the front desk. Across four modules, learners take on the roles of receptionists Miguel and Marta in different everyday situations. I was responsible for the ideation and design of the entire project, from the visual identity to the interface and programming.",
    rows=[
      [V("ribeira/mockup2.mp4", 16, 9, exact=True)],
      [V("ribeira/mockup.mp4", 16, 9, exact=True)],
      [I("ribeira/m2-escolha.webp", 16, 9, "Ecrã de escolha múltipla do módulo 2: uma hóspede sem água no quarto", True)],
      [I("ribeira/m3-boas-praticas.webp", 16, 9, "Resumo de boas práticas do módulo 3: comunicação escrita", True), I("ribeira/m3-resultados.webp", 16, 9, "Resultados do módulo 3: 2 de 3 situações certas à primeira", True)],
    ]),
  dict(slug="direct-padel", hero_focal=(50.22, 28.0), hero_grain=41, title="Direct Padel", cover="capas/padel.webp",
    hero=I("padel/hero.webp", 1425, 491),
    cat="REBRANDING / UI", cat_en="REBRANDING / UI",
    date="MARÇO 2026", date_en="MARCH 2026",
    text="O Direct Padel foi um projeto de rebranding de um clube indoor, focado na redefinição da sua identidade visual. A marca apresentava uma presença digital fraca e uma identidade pouco consistente, o que limitava a sua comunicação. Desenvolvi um sistema gráfico coeso, aplicado em diferentes pontos de contacto, incluindo produtos do clube, website, app e redes sociais, garantindo maior consistência e reconhecimento.",
    text_en="Direct Padel was a rebranding project for an indoor club, focused on redefining its visual identity. The brand had a weak digital presence and an inconsistent identity, which limited its communication. I developed a cohesive graphic system applied across different touchpoints, including club products, website, app and social media, ensuring greater consistency and recognition.",
    rows=[
      [V("padel/logo.mp4")],
      [I("padel/cores1.webp", 606, 629, "Cores Direct Padel"), I("padel/cores2.webp", 606, 629, "Cores Direct Padel")],
      [I("padel/etiqueta.webp", 400, 666, "Etiqueta Direct Padel"), I("padel/estendal.webp", 812, 666, "Polo Direct Padel")],
      [V("padel/bola.mp4")],
      [I("padel/website.webp", 1223, 742, "Website Direct Padel")],
      [V("padel/app.mp4")],
      [I("padel/appstore.webp", 555, 666, "App Direct Padel na App Store"), I("padel/notificacao.webp", 658, 666, "Notificação da app Direct Padel")],
      [I("padel/social1.jpg", 4, 5, "Publicação Direct Padel"), I("padel/social2.jpg", 4, 5, "Publicação Direct Padel"), I("padel/social3.jpg", 4, 5, "Publicação Direct Padel")],
    ]),
  dict(slug="alvor", title="Alvor", cover="capas/alvor.webp",
    hero=V("alvor/header.mp4", 1425, 491),
    h2="ALVOR",
    cat="BRANDING / UI", cat_en="BRANDING / UI",
    date="JUNHO 2026", date_en="JUNE 2026",
    text="A Alvor é uma empresa de energia solar que, para além da instalação de painéis, oferece uma plataforma própria de monitorização e gestão. Desenvolvi a identidade visual de raiz, criando um sistema gráfico que transmite confiança e modernidade. Assumi ainda o design de toda a estrutura digital da marca, incluindo o website, a área de cliente e a app de monitorização dos painéis.",
    text_en="Alvor is a solar energy company that, besides installing panels, offers its own monitoring and management platform. I developed the visual identity from scratch, creating a graphic system that conveys trust and modernity. I also designed the brand's entire digital structure, including the website, the customer area and the panel-monitoring app.",
    rows=[
      [V("alvor/logo.mp4")],
      [I("alvor/icons.webp", 606, 553, "Ícones Alvor"), I("alvor/icon-iphone.webp", 606, 553, "Ícone da app Alvor no iPhone")],
      [V("alvor/palette.mp4")],
      [I("alvor/chrome.webp", 503, 553, "Ícone Alvor"), I("alvor/watch.webp", 709, 553, "Alvor no Apple Watch")],
      [V("alvor/website.mp4")],
      [I("alvor/website.webp", 1223, 742, "Website Alvor")],
      [V("alvor/app.mp4")],
      [I("alvor/mupi.webp", 1223, 742, "Mupi Alvor")],
      [I("alvor/outdoor.webp", 1223, 742, "Outdoor Alvor")],
      [I("alvor/capacete.webp", 709, 553, "Capacete Alvor"), I("alvor/colete.webp", 503, 553, "Colete Alvor")],
      [I("alvor/banner.webp", 1223, 742, "Bandeira Alvor")],
      [I("alvor/sign1.webp", 606, 553, "Placa Alvor"), I("alvor/keychain.webp", 606, 553, "Porta-chaves Alvor")],
      [I("alvor/sign2.webp", 1223, 742, "Sinalética Alvor")],
      [I("alvor/contentor.webp", 1223, 742, "Contentor Alvor")],
    ]),
  dict(slug="full-fill", hero_focal=(49.73, 58.0), hero_grain=50, title="FULL FILL", cover="capas/fullfill.webp",
    hero=I("fullfill/hero.webp", 1425, 491),
    cat="DESIGN GRÁFICO / EDIÇÃO DE VÍDEO / SOCIAL MEDIA", cat_en="GRAPHIC DESIGN / VIDEO EDITING / SOCIAL MEDIA",
    date="2021 - 2026", date_en="2021 - 2026",
    text="A FULL FILL é uma empresa de Formação em Produtividade e Liderança Consciente, onde atuo como Creative Designer há mais de 5 anos. Assumo toda a vertente de design, vídeo e multimédia, desde a criação de conteúdos digitais, edição de vídeo e podcasts, até fotografia e gestão de redes sociais da marca. Sou ainda responsável pelo desenvolvimento de e-learnings para grandes empresas, assegurando toda a componente visual e audiovisual dos projetos.",
    text_en="FULL FILL is a training company in Productivity and Conscious Leadership, where I have worked as Creative Designer for over 5 years. I handle all design, video and multimedia work, from digital content, video and podcast editing to photography and managing the brand's social media. I am also responsible for developing e-learning for large companies, covering all the visual and audiovisual side of the projects.",
    rows=[
      [I("fullfill/thumb-ia.webp", 16, 9, "Thumbnail YouTube Full Fill", True, vimeo="1184973688")],
      [V("fullfill/antes-depois.mp4", 606, 341), V("fullfill/chatgpt.mp4", 606, 341)],
      [I("fullfill/tv.webp", 1223, 742, "Canal de YouTube Full Fill")],
      [I("fullfill/podcast.webp", 16, 9, "Thumbnail do podcast", True, vimeo="1184950178")],
      [I("fullfill/spotify-feed.webp", 606, 666, "Podcast no Spotify"), I("fullfill/spotify-app.webp", 606, 666, "Podcast no Spotify")],
      [V("fullfill/website.mp4")],
      [V("fullfill/instagram.mp4")],
      [I("fullfill/s1.webp", 1, 1), I("fullfill/s2.webp", 1, 1), I("fullfill/s3.webp", 1, 1)],
      [I("fullfill/s4.webp", 1, 1), I("fullfill/s5.webp", 1, 1), I("fullfill/s6.webp", 1, 1)],
    ]),
]

SKILLS = [("Branding", "Branding"), ("Design Gráfico", "Graphic Design"), ("Web Design", "Web Design"),
          ("Edição de Vídeo", "Video Editing"), ("Motion Graphics", "Motion Graphics"),
          ("Social Media", "Social Media"), ("UX/UI Design", "UX/UI Design"), ("E-Learning Design", "E-Learning Design")]
LOGOS = ["montepio", "bpi", "avila-spaces", "worten", "abylos", "cuf", "full-fill", "continente", "perfumes-e-companhia", "sonae"]
LOGO_ALT = {"montepio": "Montepio", "bpi": "BPI", "avila-spaces": "Avila Spaces", "worten": "Worten", "abylos": "Abylos",
            "cuf": "CUF", "full-fill": "Full Fill", "continente": "Continente", "perfumes-e-companhia": "Perfumes&Companhia", "sonae": "Sonae"}

# ---------------------------------------------------------------------------
def t(pt, en):
    """texto com tradução (o JS troca para EN)"""
    return f'<span data-en="{html.escape(en, quote=True)}">{pt}</span>' if pt != en else pt

# envelope cheio, no mesmo estilo do ícone do LinkedIn (forma sólida); o "V" da aba é um recorte
MAIL_SVG = '<svg viewBox="0 0 24 18" aria-hidden="true"><path fill-rule="evenodd" d="M2 0h20a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM3 3.2l9 7 9-7v1.9l-9 7-9-7z"/></svg>'
LI_SVG = '<svg viewBox="19 17 28 28" aria-hidden="true"><path d="M20.4 44h5.4V26.6h-5.4V44zm2.7-26.1c-1.7 0-3.1 1.4-3.1 3.1 0 1.7 1.4 3.1 3.1 3.1 1.7 0 3.1-1.4 3.1-3.1 0-1.7-1.4-3.1-3.1-3.1zm16.4 8.3c-2.6 0-4.4 1.4-5.1 2.8h-.1v-2.4h-5.2V44h5.4v-8.6c0-2.3.4-4.5 3.2-4.5 2.8 0 2.8 2.6 2.8 4.6V44H46v-9.5c0-4.7-1-8.3-6.5-8.3z"/></svg>'
CARET = '<svg viewBox="0 0 22 22" aria-hidden="true"><path d="M5 8.5l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>'

def head(title, prefix, desc):
    return f'''<!doctype html>
<html lang="pt-PT">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-5FXH4YBJM7"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-5FXH4YBJM7');
</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{prefix}assets/capas/alvor.webp">
<link rel="icon" href="{prefix}assets/geral/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700&family=Roboto:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="{prefix}css/style.css?v={VERSION}">
</head>'''

def header(prefix, active):
    a1 = ' aria-current="page"' if active == "projetos" else ""
    a2 = ' aria-current="page"' if active == "sobre" else ""
    return f'''<a class="skip" href="#conteudo">{t("Saltar para o conteúdo", "Skip to content")}</a>
<header class="site-header">
  <a class="site-title" href="{prefix or "./"}">André Alves</a>
  <nav class="site-nav" aria-label="Principal">
    <a href="{prefix or "./"}"{a1}>{t("Projetos", "Projects")}</a>
    <a href="{prefix}sobre-mim/"{a2}>{t("Sobre mim", "About me")}</a>
  </nav>
  <div class="header-actions">
    <a class="social social-mail" href="mailto:{EMAIL}" aria-label="Email">{MAIL_SVG}</a>
    <a class="social" href="{LINKEDIN}" target="_blank" rel="noopener" aria-label="LinkedIn">{LI_SVG}</a>
    <div class="lang">
      <button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false"><span class="lang-current">Português</span>{CARET}</button>
      <ul class="lang-menu" hidden>
        <li><button type="button" data-set-lang="pt">Português</button></li>
        <li><button type="button" data-set-lang="en">English</button></li>
      </ul>
    </div>
  </div>
  <button type="button" class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
</header>
<div class="mobile-menu" hidden>
  <nav aria-label="Menu">
    <a href="{prefix or "./"}">{t("Projetos", "Projects")}</a>
    <a href="{prefix}sobre-mim/">{t("Sobre mim", "About me")}</a>
  </nav>
  <div class="mobile-menu-foot">
    <a class="social social-mail" href="mailto:{EMAIL}" aria-label="Email">{MAIL_SVG}</a>
    <a class="social" href="{LINKEDIN}" target="_blank" rel="noopener" aria-label="LinkedIn">{LI_SVG}</a>
    <button type="button" data-set-lang="pt">PT</button><button type="button" data-set-lang="en">EN</button>
  </div>
</div>'''

def footer(prefix):
    return f'''<footer class="site-footer">
  <div class="footer-inner">
    <p class="footer-mail"><a href="mailto:{EMAIL}">{EMAIL}</a></p>
    <p class="footer-nav"><a href="{prefix or "./"}"><strong>{t("PROJETOS", "PROJECTS")}</strong></a><a href="{prefix}sobre-mim/"><strong>{t("SOBRE MIM", "ABOUT ME")}</strong></a></p>
    <p class="footer-copy">© André Alves, 2026</p>
  </div>
</footer>
<div class="fab" aria-label="Atalhos" data-aria-en="Shortcuts">
  <button type="button" class="fab-btn fab-top" data-to-top aria-label="Voltar ao topo" data-aria-en="Back to top"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  <button type="button" class="fab-btn fab-contact" data-open-contact aria-haspopup="dialog" aria-label="Enviar mensagem" data-aria-en="Send a message"><img src="{prefix}assets/geral/avatar.webp" srcset="{prefix}assets/geral/avatar.webp 1x, {prefix}assets/geral/avatar@2x.webp 2x" alt="" width="56" height="56"></button>
</div>
<dialog class="contact" id="contact" aria-labelledby="contact-title" data-lenis-prevent>
  <form class="contact-form" data-endpoint="{CONTACT_ENDPOINT}" data-key="{CONTACT_KEY}" data-to="{EMAIL}" novalidate>
    <button type="button" class="contact-close" data-close-contact aria-label="Fechar" data-aria-en="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
    <h2 id="contact-title">{t("Entre em contacto", "Get in touch")}</h2>
    <p class="contact-lead">{t("Escreva a sua mensagem e indique o seu email.", "Please write your message and provide your email address.")}</p>
    <label for="c-email">{t("O seu email", "Your email")}</label>
    <input id="c-email" name="email" type="email" required autocomplete="email" inputmode="email">
    <label for="c-msg">{t("Mensagem", "Message")}</label>
    <textarea id="c-msg" name="message" rows="6" required></textarea>
    <input class="hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button type="submit" class="button contact-send">{t("Enviar mensagem", "Send message")}</button>
    <p class="contact-status" role="status" aria-live="polite"></p>
  </form>
</dialog>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js"></script>
<script src="{prefix}js/main.js?v={VERSION}"></script>
</body>
</html>
'''

def poster_bg(m, prefix):
    """vídeos: a imagem de preview também fica de fundo do espaço, para aparecer logo, mesmo antes de o leitor de vídeo estar pronto"""
    if m["t"] != "video": return ""
    return f';background:url({prefix}assets/{m["src"][:-4]}-poster.webp) center/cover'

def media(m, prefix, cls=""):
    src = prefix + "assets/" + m["src"]
    if m["t"] == "video":
        poster = src[:-4] + "-poster.webp"
        if m.get("sync"):   # vídeos sincronizados: o main.js arranca-os todos ao mesmo tempo (sem autoplay individual)
            return f'<video class="{cls}" src="{src}" poster="{poster}" data-sync="{m["sync"]}" muted loop playsinline preload="auto" aria-hidden="true"></video>'
        return f'<video class="{cls}" src="{src}" poster="{poster}" autoplay muted loop playsinline preload="auto" aria-hidden="true"></video>'
    alt = html.escape(m.get("alt", ""), quote=True)
    img = f'<img class="{cls}" src="{src}" alt="{alt}" loading="lazy" decoding="async">'
    if m.get("vimeo"):   # imagem que abre o leitor do Vimeo ao carregar no play
        img += f'<button class="play-btn" type="button" data-vimeo="{m["vimeo"]}" aria-label="Reproduzir vídeo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5 19 12 7 19.5z" stroke-linejoin="round" stroke-width="1.6"/></svg></button>'
    return img

def write(path, content):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f: f.write(content)

# ---------- home ----------
tiles = []
for i, p in enumerate(PROJECTS):
    load = "eager" if i < 2 else "lazy"
    tiles.append(f'''    <a class="grid-item fade clip" href="projetos/{p["slug"]}/">
      <img src="assets/{p["cover"]}" alt="{html.escape(p["title"])}" loading="{load}" decoding="async">
      <span class="grid-overlay"><span class="grid-text"><span class="grid-title">{p["title"]}</span><span class="grid-meta"><strong>{t(p["cat"], p["cat_en"])}</strong><span>{t(p["date"], p["date_en"])}</span></span></span></span>
    </a>''')
write("index.html", head("André Alves", "", "Portfólio de André Alves, designer gráfico.") + f'''
<body class="page-home">
{header("", "projetos")}
<main id="conteudo">
  <div class="portfolio-grid">
{chr(10).join(tiles)}
  </div>
</main>
{footer("")}''')

# ---------- projetos ----------
for idx, p in enumerate(PROJECTS):
    pre = "../../"
    prev = PROJECTS[idx - 1] if idx > 0 else None                  # o primeiro projeto não tem "anterior"
    nxt = PROJECTS[idx + 1] if idx < len(PROJECTS) - 1 else None   # o último não tem "próximo"
    rows = []
    for r in p["rows"]:
        cols = " ".join(f'{m["w"]}fr' for m in r)
        # vídeos da galeria: sempre 16:9 exato
        # imagem grande sozinha: sempre 16:9, como os vídeos
        # restantes imagens: proporção do layout original
        if len(r) == 1 and r[0]["t"] == "img" and not r[0].get("exact"):
            r = [dict(r[0], w=WIDE[0], h=WIDE[1])]
        items = "".join(f'<div class="gallery-item fade clip" style="aspect-ratio:{str(WIDE[0]) + "/" + str(WIDE[1]) if (m["t"] == "video" and not m.get("exact")) else str(m["w"]) + "/" + str(m["h"])}{poster_bg(m, pre)}">{media(m, pre)}</div>' for m in r)
        # duas imagens lado a lado: todas com a mesma altura da linha manual + cartão (PAIR_ROW)
        pair = len(r) == 2 and all(m["t"] == "img" and not m.get("exact") for m in r)
        cls = "gallery-row row-pair" if pair else "gallery-row"
        rows.append(f'    <div class="{cls}" style="grid-template-columns:{cols}">{items}</div>')
    hero = p["hero"]
    hero_html = media(hero, pre, "hero-media").replace('loading="lazy"', 'fetchpriority="high"')
    hero_attrs = ""
    if p.get("hero_focal"):   # enquadramento (ponto focal) da imagem de topo, em %
        fx, fy = p["hero_focal"]
        hero_html = hero_html.replace('<img class="hero-media"', f'<img class="hero-media" style="object-position:{fx}% {fy}%"', 1)
        hero_attrs += f' data-focal="{fx},{fy}"'
    if p.get("hero_grain"):   # grão de película animado (intensidade em %)
        hero_attrs += f' data-grain="{p["hero_grain"]}"'
    if p.get("hero_gradient"):   # gradiente animado em loop por cima da imagem de topo, nos tons dela
        hero_html += '<div class="hero-gradient" aria-hidden="true" style="--hg:linear-gradient(115deg,' + ",".join(p["hero_gradient"]) + ')"><i class="blob b1"></i><i class="blob b2"></i><i class="blob b3"></i><i class="blob b4"></i></div>'
    pag_prev = (f'''<a class="pag-prev" href="../{prev["slug"]}/"><svg viewBox="0 0 9 16" aria-hidden="true"><polyline fill="none" points="7.3,14.7 2.5,8 7.3,1.2"/></svg><span class="vh">{t("Anterior", "Previous")}</span><span class="pag-title">{prev["title"]}</span></a>''' if prev else "")
    pag_next = (f'''<a class="pag-next" href="../{nxt["slug"]}/"><span class="vh">{t("Próximo", "Next")}</span><span class="pag-title">{nxt["title"]}</span><svg viewBox="0 0 9 16" aria-hidden="true"><polyline fill="none" points="1.6,1.2 6.5,7.9 1.6,14.7"/></svg></a>''' if nxt else "")
    project_link = (f'        <a class="button button-light" data-type href="{p["link"]}" target="_blank" rel="noopener">{t(p["link_pt"], p["link_en"])}</a>{chr(10)}' if p.get("link") else "")
    side_open, side_close = ('      <div class="info-side">'+chr(10), '      </div>'+chr(10)) if p.get("link") else ("", "")
    h2 = p.get("h2", p["title"].upper() if p["slug"] != "unlock-the-magic" else p["title"])
    body = f'''
<body class="page-project">
{header(pre, "projetos")}
<main id="conteudo">
  <section class="project-hero fade"{hero_attrs}>{hero_html}</section>
  <section class="project-info">
    <div class="info-grid" data-type-group>
      <h2 class="info-title" data-type><strong>{h2}</strong></h2>
{side_open}      <div class="info-meta" data-type>
        <p><strong>{t(p["cat"], p["cat_en"])}</strong></p>
        <p>{t(p["date"], p["date_en"])}</p>
      </div>
{project_link}{side_close}      <p class="info-text" data-type>{t(p["text"], p["text_en"])}</p>
    </div>
  </section>
  <section class="project-gallery">
{chr(10).join(rows)}
  </section>
  <nav class="item-pagination" aria-label="Projetos">
    {pag_prev}
    {pag_next}
  </nav>
</main>
{footer(pre)}'''
    desc = html.unescape(p["text"])[:155].replace('"', "'")
    write(f'projetos/{p["slug"]}/index.html', head(f'{p["title"]} - André Alves', pre, desc) + body)

# ---------- sobre mim ----------
pre = "../"
paras = [
  ("Sou designer gráfico, licenciado em Design e Produção Gráfica e com formação superior em Marketing Digital.",
   "I'm a graphic designer with a degree in Design and Graphic Production and higher education in Digital Marketing."),
  ("Com o domínio de um vasto leque de ferramentas, atuo em diferentes áreas, desde branding e design digital até multimédia e motion.",
   "Proficient in a wide range of tools, I work across different areas, from branding and digital design to multimedia and motion."),
  ("Nos últimos anos tenho-me especializado no desenvolvimento de conteúdos e-learning, desde a sua conceção visual até à implementação nas plataformas.",
   "In recent years I have specialised in developing e-learning content, from its visual concept to its implementation on platforms."),
  ("Sou um entusiasta de inteligência artificial, com formação e workshops que me permitem integrar as mais recentes tecnologias no meu trabalho.",
   "I'm an artificial intelligence enthusiast, with training and workshops that allow me to bring the latest technologies into my work."),
]
ps = "\n".join(f'      <p data-type>{t(a, b)}</p>' for a, b in paras)
col1 = "".join(f'<h4>{t(a, b)}</h4>' for a, b in SKILLS[:5])
col2 = "".join(f'<h4>{t(a, b)}</h4>' for a, b in SKILLS[5:])
# carrossel infinito: a lista de logos aparece duas vezes seguidas; a segunda cópia é só visual (aria-hidden)
logo_set = "".join(f'<li class="logo"><img src="{pre}assets/geral/logos/{l}.webp" alt="{LOGO_ALT[l]}"></li>' for l in LOGOS)
logo_copy = "".join(f'<li class="logo"><img src="{pre}assets/geral/logos/{l}.webp" alt=""></li>' for l in LOGOS)
logos = f'<ul class="marquee-track">{logo_set}</ul><ul class="marquee-track" aria-hidden="true">{logo_copy}</ul>'
write("sobre-mim/index.html", head("Sobre mim - André Alves", pre, "André Alves, designer gráfico licenciado em Design e Produção Gráfica.") + f'''
<body class="page-about">
{header(pre, "sobre")}
<main id="conteudo">
  <section class="about-intro">
    <div class="about-text" data-type-group>
      <h1 data-type>{t("Olá, sou o André", "Hi, I'm André")}</h1>
{ps}
      <a class="button" data-type href="{pre}{CV}" target="_blank" rel="noopener">{t("Currículo", "Résumé")}</a>
    </div>
    <div class="about-photo fade clip clip-x"><img src="{pre}assets/geral/foto.webp" alt="André Alves"></div>
  </section>
  <section class="about-skills" data-type-group>
    <h1 data-type>{t("Competências", "Skills")}</h1>
    <div class="skills-cols fade"><div>{col1}</div><div>{col2}</div></div>
  </section>
  <section class="about-clients" data-type-group>
    <h1 data-type>{t("Clientes", "Clients")}</h1>
    <h4 class="clients-note" data-type>{t("Algumas das empresas com quem tive o prazer de colaborar ao longo dos últimos 6 anos", "Some of the companies I've had the pleasure of working with over the last 6 years")}</h4>
    <div class="logos marquee fade">{logos}</div>
  </section>
</main>
{footer(pre)}''')

# ---------- página 404 (o GitHub Pages serve este ficheiro em qualquer endereço que não exista; caminhos absolutos) ----------
write("404.html", head("Página não encontrada - André Alves", "/", "Esta página não existe.") + f'''
<body class="page-home">
{header("/", "")}
<main id="conteudo">
  <section class="notfound">
    <h1>{t("Página não encontrada", "Page not found")}</h1>
    <p>{t("O endereço que procuras não existe ou mudou de sítio.", "The page you are looking for does not exist or has moved.")}</p>
    <a class="button" href="/">{t("Ver projetos", "View projects")}</a>
  </section>
</main>
{footer("/")}''')

# ficheiros para o GitHub Pages
write(".nojekyll", "")
write("CNAME", "www.andrealvesdesign.com" + chr(10))

print("ok")
