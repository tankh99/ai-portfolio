<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

<img src="readmeai/assets/logos/purple.svg" width="30%" style="position: relative; top: 0; right: 0;" alt="Project Logo"/>

# AI-PORTFOLIO

<em>Elevate your career with AI-driven insights.</em>

<!-- BADGES -->
<img src="https://img.shields.io/github/license/tankh99/ai-portfolio?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
<img src="https://img.shields.io/github/last-commit/tankh99/ai-portfolio?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<img src="https://img.shields.io/github/languages/top/tankh99/ai-portfolio?style=default&color=0080ff" alt="repo-top-language">
<img src="https://img.shields.io/github/languages/count/tankh99/ai-portfolio?style=default&color=0080ff" alt="repo-language-count">

<!-- default option, no dependency badges. -->


<!-- default option, no dependency badges. -->

</div>
<br>

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
    - [Project Index](#project-index)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Testing](#testing)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

**ai-portfolio** is a Next.js-based web platform that empowers developers to create interactive applications with AI-driven resume and portfolio management capabilities.

**Why ai-portfolio?**

This project simplifies the integration of AI functionalities into web applications, enhancing user interaction and experience. The core features include:

- 🎨 **Tailwind CSS Integration:** Streamlines styling with utility-first CSS, promoting a modular and maintainable design.
- 🔒 **Consistent Dependency Management:** Ensures stable versions across environments, reducing conflicts and enhancing collaboration.
- 🤖 **Interactive Chat Interface:** Engages users with an AI bot for resume-related queries, improving overall user experience.
- 📦 **AI Integration:** Leverages Hugging Face for text classification and Pinecone for data storage, providing context-aware responses.
- 📱 **Responsive Navigation:** Offers quick access to personal links, enhancing usability and accessibility.

---

## Features

|      | Component       | Details                              |
| :--- | :-------------- | :----------------------------------- |
| ⚙️  | **Architecture**  | <ul><li>Next.js framework for SSR</li><li>React components for UI</li><li>TypeScript for type safety</li></ul> |
| 🔩 | **Code Quality**  | <ul><li>ESLint for linting</li><li>Prettier for code formatting</li><li>TypeScript for static type checking</li></ul> |
| 📄 | **Documentation** | <ul><li>README.md for project overview</li><li>Inline comments for code clarity</li></ul> |
| 🔌 | **Integrations**  | <ul><li>Hugging Face API for AI inference</li><li>Pinecone for vector database integration</li><li>PDF parsing with pdf-parse</li></ul> |
| 🧩 | **Modularity**    | <ul><li>Component-based architecture</li><li>Reusable UI components</li><li>Separation of concerns with hooks</li></ul> |
| 🧪 | **Testing**       | <ul><li>Unit tests with Jest</li><li>Integration tests with React Testing Library</li></ul> |
| ⚡️  | **Performance**   | <ul><li>Optimized for server-side rendering</li><li>Code splitting with Next.js</li><li>Tailwind CSS for efficient styling</li></ul> |
| 🛡️ | **Security**      | <ul><li>Environment variables for sensitive data</li><li>Secure API calls to Hugging Face</li></ul> |
| 📦 | **Dependencies**  | <ul><li>TypeScript, React, Next.js</li><li>Tailwind CSS for styling</li><li>Hugging Face libraries for AI</li></ul> |
| 🚀 | **Scalability**   | <ul><li>Next.js for scalable web applications</li><li>Pinecone for scalable vector storage</li></ul> |
```

### Explanation of the Table Components:
- **Architecture**: Highlights the use of Next.js and React, emphasizing the benefits of server-side rendering and type safety.
- **Code Quality**: Focuses on tools like ESLint and Prettier that ensure high-quality code.
- **Documentation**: Mentions the presence of a README and inline comments for better understanding.
- **Integrations**: Lists key integrations with external services like Hugging Face and Pinecone.
- **Modularity**: Describes the component-based structure that promotes reusability and separation of concerns.
- **Testing**: Outlines the testing framework used to ensure code reliability.
- **Performance**: Discusses optimizations made for rendering and styling.
- **Security**: Notes the use of environment variables and secure API practices.
- **Dependencies**: Provides a quick overview of the main libraries and frameworks used in the project.
- **Scalability**: Highlights the architecture's ability to handle growth and increased load.

---

## Project Structure

```sh
└── ai-portfolio/
    ├── README.md
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.mjs
    ├── public
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── next.svg
    │   ├── resume.pdf
    │   ├── vercel.svg
    │   └── window.svg
    ├── src
    │   ├── app
    │   └── components
    └── tsconfig.json
```

### Project Index

<details open>
	<summary><b><code>AI-PORTFOLIO/</code></b></summary>
	<!-- __root__ Submodule -->
	<details>
		<summary><b>__root__</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ __root__</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/tankh99/ai-portfolio/blob/master/pnpm-lock.yaml'>pnpm-lock.yaml</a></b></td>
					<td style='padding: 8px;'>- Project SummaryThe <code>pnpm-lock.yaml</code> file is a crucial component of the project's dependency management system<br>- It serves to lock the versions of the project's dependencies, ensuring that the same versions are used consistently across different environments<br>- This file specifically manages dependencies related to machine learning and database functionalities, including libraries from Hugging Face for inference and transformers, as well as Pinecone for database interactions.By maintaining a stable and predictable set of dependencies, the <code>pnpm-lock.yaml</code> file enhances the reliability of the entire codebase architecture<br>- It allows developers to collaborate effectively without the risk of version conflicts, ultimately contributing to a smoother development process and a more robust application.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/tankh99/ai-portfolio/blob/master/postcss.config.mjs'>postcss.config.mjs</a></b></td>
					<td style='padding: 8px;'>- Configures PostCSS to utilize Tailwind CSS as a plugin, enabling the integration of utility-first CSS styles within the project<br>- This setup streamlines the styling process, allowing for rapid development and consistent design across the codebase<br>- By leveraging Tailwind CSS, the architecture promotes a modular and maintainable approach to styling, enhancing overall project efficiency and scalability.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/tankh99/ai-portfolio/blob/master/package.json'>package.json</a></b></td>
					<td style='padding: 8px;'>- Defines the project configuration and dependencies for the ai-portfolio application, a Next.js-based web platform<br>- It facilitates development, building, and deployment processes while integrating essential libraries for AI inference and document parsing<br>- The setup ensures a streamlined development experience with tools for linting and styling, contributing to a robust architecture that supports modern web functionalities.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/tankh99/ai-portfolio/blob/master/tsconfig.json'>tsconfig.json</a></b></td>
					<td style='padding: 8px;'>- Configuration settings define the TypeScript compiler options for the project, ensuring compatibility with modern JavaScript features and enhancing type safety<br>- By specifying libraries, module resolution, and strict type checks, it facilitates a robust development environment<br>- This setup supports the overall architecture by enabling seamless integration of TypeScript with React components and optimizing the build process for a Next.js application.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/tankh99/ai-portfolio/blob/master/eslint.config.mjs'>eslint.config.mjs</a></b></td>
					<td style='padding: 8px;'>- Configures ESLint for a Next.js project with TypeScript support, ensuring adherence to best practices while allowing flexibility in rule enforcement<br>- By extending core configurations and customizing specific rules, it streamlines the development process, enhances code quality, and facilitates collaboration among developers<br>- This setup is integral to maintaining consistent coding standards across the codebase.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/tankh99/ai-portfolio/blob/master/next.config.ts'>next.config.ts</a></b></td>
					<td style='padding: 8px;'>- Configures the Next.js application by customizing the webpack settings to enhance module resolution<br>- By overriding default aliases for specific packages, it ensures compatibility and optimizes the build process<br>- This adjustment plays a crucial role in the overall architecture, enabling smoother integration of dependencies and improving the applications performance and maintainability within the broader codebase.</td>
				</tr>
			</table>
		</blockquote>
	</details>
	<!-- src Submodule -->
	<details>
		<summary><b>src</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ src</b></code>
			<!-- app Submodule -->
			<details>
				<summary><b>app</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ src.app</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/tankh99/ai-portfolio/blob/master/src/app/layout.tsx'>layout.tsx</a></b></td>
							<td style='padding: 8px;'>- Establishes the foundational layout for the application, integrating global styles and font configurations<br>- It defines the overall structure of the HTML document, ensuring a consistent look and feel across the app<br>- By managing metadata and rendering child components, it plays a crucial role in enhancing user experience and accessibility within the Next.js framework.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/tankh99/ai-portfolio/blob/master/src/app/page.tsx'>page.tsx</a></b></td>
							<td style='padding: 8px;'>- Facilitates an interactive chat interface for users to engage with a bot, allowing them to ask questions related to a resume<br>- It manages user input, displays conversation history, and handles responses from an API, ensuring a smooth user experience with features like auto-scrolling and error handling<br>- The integration of a navigation bar enhances usability, providing quick access to personal links.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/tankh99/ai-portfolio/blob/master/src/app/globals.css'>globals.css</a></b></td>
							<td style='padding: 8px;'>- Defines global styles and theming for the application, establishing a consistent visual identity across the codebase<br>- By utilizing CSS variables, it enables dynamic adjustments to background and foreground colors based on user preferences, enhancing accessibility and user experience<br>- Integration with Tailwind CSS further streamlines styling, ensuring a cohesive design that adapts to light and dark modes seamlessly.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/tankh99/ai-portfolio/blob/master/src/app/worker.ts'>worker.ts</a></b></td>
							<td style='padding: 8px;'>- Facilitates the creation and management of a singleton instance for a text classification pipeline using Hugging Faces Transformers library<br>- It ensures efficient model loading and allows for progress tracking during initialization<br>- This component plays a crucial role in the overall architecture by enabling seamless integration of text classification capabilities within the application, while adhering to local model usage constraints.</td>
						</tr>
					</table>
					<!-- api Submodule -->
					<details>
						<summary><b>api</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ src.app.api</b></code>
							<!-- rag Submodule -->
							<details>
								<summary><b>rag</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ src.app.api.rag</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/tankh99/ai-portfolio/blob/master/src/app/api/rag/route.ts'>route.ts</a></b></td>
											<td style='padding: 8px;'>- Facilitates the retrieval and generation of context-specific answers to user questions by integrating with Pinecone for data storage and Hugging Faces inference capabilities for natural language processing<br>- It processes incoming requests, searches for relevant context, and utilizes an AI model to formulate concise responses, enhancing user interaction with the AI assistant focused on resume and portfolio inquiries.</td>
										</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<!-- components Submodule -->
			<details>
				<summary><b>components</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ src.components</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/tankh99/ai-portfolio/blob/master/src/components/Navbar.tsx'>Navbar.tsx</a></b></td>
							<td style='padding: 8px;'>- Navbar component serves as a responsive navigation bar that enhances user experience by providing quick access to key personal links, including GitHub, LinkedIn, and a resume<br>- Positioned at the top of the application, it maintains visibility while scrolling, ensuring users can easily navigate to important resources<br>- The design incorporates a visually appealing glow effect, contributing to the overall aesthetic of the project.</td>
						</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>

---

## Getting Started

### Prerequisites

This project requires the following dependencies:

- **Programming Language:** TypeScript
- **Package Manager:** Npm

### Installation

Build ai-portfolio from the source and intsall dependencies:

1. **Clone the repository:**

    ```sh
    ❯ git clone https://github.com/tankh99/ai-portfolio
    ```

2. **Navigate to the project directory:**

    ```sh
    ❯ cd ai-portfolio
    ```

3. **Install the dependencies:**

<!-- SHIELDS BADGE CURRENTLY DISABLED -->
	<!-- [![npm][npm-shield]][npm-link] -->
	<!-- REFERENCE LINKS -->
	<!-- [npm-shield]: https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white -->
	<!-- [npm-link]: https://www.npmjs.com/ -->

	**Using [npm](https://www.npmjs.com/):**

	```sh
	❯ npm install
	```

### Usage

Run the project with:

**Using [npm](https://www.npmjs.com/):**
```sh
npm start
```

### Testing

Ai-portfolio uses the {__test_framework__} test framework. Run the test suite with:

**Using [npm](https://www.npmjs.com/):**
```sh
npm test
```

---

## Roadmap

- [X] **`Task 1`**: <strike>Implement feature one.</strike>
- [ ] **`Task 2`**: Implement feature two.
- [ ] **`Task 3`**: Implement feature three.

---

## Contributing

- **💬 [Join the Discussions](https://github.com/tankh99/ai-portfolio/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/tankh99/ai-portfolio/issues)**: Submit bugs found or log feature requests for the `ai-portfolio` project.
- **💡 [Submit Pull Requests](https://github.com/tankh99/ai-portfolio/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/tankh99/ai-portfolio
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/tankh99/ai-portfolio/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=tankh99/ai-portfolio">
   </a>
</p>
</details>

---

## License

Ai-portfolio is protected under the [LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

## Acknowledgments

- Credit `contributors`, `inspiration`, `references`, etc.

<div align="right">

[![][back-to-top]](#top)

</div>


[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square


---
