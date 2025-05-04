# Frontend for my CV website

Visit [cv.subhranilmukherjee.com](https://cv.subhranilmukherjee.com).

This can be customized for use by anyone just by modifying [projects.js](./src/projects.js) 
and [userdetails.js](./src/userdetails.js). [index.html](./src/index.html) is generated 
at runtime based on project and user details.

This repo also contains a GitHub action([resume.yml](./.github/workflows/resume.yml)) to compile 
and generate a LaTeX PDF from those details, and publish a new release. It also renders and 
saves a screenshot of the website, and attaches that to the release.

Finally, there's another action ([deploy.yml](./.github/workflows/deploy.yml)) to automatically 
prerender and deploy [index.html](./src/index.html) as an Azure static website on each commit.

Currently the website looks like the following:
![Website](https://github.com/iamsubhranil/CVFrontend/releases/latest/download/screenshot.jpg)
