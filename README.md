# DICK. Network (Data Innovation Code Knowledge) 

![Version](https://img.shields.io/badge/version-Beta-blue.svg)
![License](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-green.svg)
![Tech Stack](https://img.shields.io/badge/tech-Node.js%20%7C%20Express%20%7C%20Vanilla%20JS-black)

> *"Exploring the intersection of technology and creativity. Thoughts have no boundaries, truth is unobservable."*

**DICK. Network** is a highly customized, aesthetically pleasing blogging engine built by **SanGuai Inc.** It transforms standard Markdown (`.md`) files into a rich, interactive web experience using a dynamic Node.js backend and a Glassmorphism (frosted glass) frontend architecture.

🌐 **Live Demo:** [https://www.sankuai.asia](https://www.sankuai.asia)

---

## ✨ Core Features

* 🎨 **Glassmorphism UI:** Premium frosted glass design system with seamless Light/Dark mode transitions.
* ⚡ **Dynamic Markdown Rendering:** Parses `.md` files on the fly. Includes deep integration with `marked.js` and `Prism.js` for beautiful typography and syntax highlighting.
* 🗂️ **Advanced File Explorer (SPA):** Dual-view architecture (Dashboard & Feed) featuring a dynamic, recursive file tree for cross-filtering articles by `#Tags` and `@Authors`.
* 📈 **Network Activity Graph:** A GitHub-style contribution graph that visualizes your writing activity over the past 180 days.
* 🛡️ **Content Governance:** * **Geofence System:** Auto-detects CN IP addresses and applies Gaussian blur to restricted content.
    * **NSFW Modal:** Built-in 18+ content warning and screening.
* 🖋️ **Epic Typography & Components:** * **Drop Caps:** Automatic epic drop caps for the first letter of post-title paragraphs.
    * **Status Boxes:** 13+ semantic status blocks (Topics, Questions, Warnings, Pilcrows) for structured writing.
    * **Magic Links:** Underline-free links with physics-based, translucent hover tooltips.
    * **Auto Copyright:** Dynamically generated CC BY-NC-SA 4.0 citation blocks at the end of each post.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Frontend:** Vanilla JavaScript, HTML5, CSS3 (No heavy frontend frameworks)
* **Markdown Parsing:** Marked.js
* **Syntax Highlighting:** Prism.js
* **Translation:** OpenCC (Simplified/Traditional Chinese runtime conversion)

---

## 🚀 Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) (v14 or higher recommended)
* NPM or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/orlysankuai-sudo/blog-design-about-www.sankuai.asia.git](https://github.com/orlysankuai-sudo/blog-design-about-www.sankuai.asia.git)
   cd dick-network
Install dependencies:

Bash
npm install express marked
Start the server:

Bash
npm start
# or
node server.js
Open your browser and navigate to:
http://localhost:3000

📁 Directory Structure
Plaintext
📦 DICK. Network
 ┣ 📂 posts             # Your Markdown (.md) articles go here
 ┣ 📂 public
 ┃ ┣ 📂 assets          # Images, SVGs (like the Error Fox), and Music
 ┃ ┣ 📂 css
 ┃ ┃ ┗ 📜 style.css     # Global styles and Glassmorphism UI
 ┃ ┣ 📂 js
 ┃ ┃ ┗ 📜 app.js        # Core frontend logic, routing, and animations
 ┃ ┣ 📜 index.html      # Main SPA entry point
 ┃ ┗ 📜 developer.html  # Developer guide & component docs
 ┣ 📜 server.js         # Express backend & Markdown parser
 ┗ 📜 package.json
✍️ Writing a Post (Frontmatter)
To create a new article, simply drop a .md file into the /posts directory. Ensure the top of your file follows this structure:

Markdown
# Your Article Title
Author: Your Name
#Tag1 #Tag2

---
(Leave an empty line above, then start your markdown content here...)
Note: The system automatically extracts the file creation date for the timeline and copyright block.

⚖️ License & Copyright
Codebase: MIT License

Content/Articles: Licensed under CC BY-NC-SA 4.0.

Copyright: © 2026 SanGuai Inc. & SanGuai Culture Studio. All Rights Reserved.


