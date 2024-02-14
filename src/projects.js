export const data = [
	{
		version: "cpp",
		oneliner: "Compiler Enthusiast & Programmer",
		summary:
			"Dedicated and highly skilled software engineer with a strong background in developing \
                    high-performance software systems. Successfully designed and implemented a wide range of projects showcasing \
                    innovative solutions and performance optimizations. Seeking an opportunity to leverage technical expertise \
                    for the organization's success.",
		showcase: [
			{
				name: "A dynamically typed programming language",
				link: "https://github.com/iamsubhranil/Next",
				details: [
					"Developed a high-performance, object-oriented programming language in C++",
					"Outperformed Python and Lua in benchmark tests",
					"Implemented a fast bytecode virtual machine",
					"Employed a custom arena-based memory allocator for a 20% speed boost",
					"Initial JIT implementation using the LLVM C API already showing 6x performance improvements",
					"Managed CI/CD processes for the project using GitHub actions",
				],
			},
			{
				name: "An Intel 8085 simulator",
				link: "https://github.com/iamsubhranil/The8085_v2",
				details: [
					"Developed a streamlined, high-performance 8085 simulator in pure C",
					"The simulator provides full support for original 8085 opcodes",
					"Includes an integrated assembler, disassembler, debugger, and virtual machine",
					"Offers a comprehensive suite for program compilation, debugging, and execution of 8085 programs",
					"Designed for efficiency and includes a tab completion-based Read-Eval-Print Loop (REPL)",
				],
			},
			{
				name: "A x86 Operating System",
				link: "https://github.com/iamsubhranil/MyOS",
				details: [
					"Designed and implemented an x86-based operating system using C++",
					"Implemented interrupts using descriptor tables",
					"Features virtual memory based on two level paging and a hybrid tree based heap",
					"Introduced time slice based round-robin preemptive multitasking",
					"Added console output with detailed stack traces for effective debugging and troubleshooting",
				],
			},
			{
				name: "NTP Clock",
				link: "https://github.com/iamsubhranil/NTPClock2",
				details: [
					"Created an ESP32-based digital clock integrated with a dot matrix display",
					"The codebase, developed in C++, features an NTP clock with a web-based configuration page",
					"Added a BMP280 temperature sensor and an automated on/off function based on the time of day",
				],
			},
			{
				name: "3D Renderer",
				link: "https://github.com/iamsubhranil/Renderer",
				details: [
					"Developed a C++-based OBJ file renderer using SDL",
					"Implemented controls for translating and rotating the rendered object within the window",
					"Provided a user-friendly and interactive UI for 3D rendering experience",
				],
			},
			{
				name: "Home Lab",
				details: [
					"Managing and orchestrating a diverse set of 30+ Docker containers, spanning health check, media management, home automation, and ad-blocking services",
					"Utilizing a two-tiered storage approach with LVM to enhance caching capabilities",
					"Configured a robust reverse proxy system with Nginx and Let's Encrypt for secure SSL connections",
					"Implemented Authelia as a Single Sign-On (SSO) solution, enhancing security through two-factor authentication using Microsoft Authenticator",
					"Set up alerts and monitoring using Prometheus and Grafana for system health and performance tracking",
					"Established remote server access and extended network accessibility via Wireguard, facilitated by a VPS hosted on Microsoft Azure",
				],
			},
		],
		others: [
			{
				name: "OpenWRTSnapshot",
				link: "https://github.com/iamsubhranil/OpenWRTSnapshot",
				desc: "A collection of scripts to build, install, and automatically set up a customized version of OpenWRT for my home routers",
			},
			{
				name: "AutoCar",
				link: "https://github.com/iamsubhranil/AutoCar",
				desc: "A self-learned racing game powered by neural networks and a genetic algorithm written in Python",
			},
			{
				name: "ThinkDifferent",
				link: "https://github.com/iamsubhranil/ThinkDifferent",
				desc: "A music player written in Java",
			},
			{
				name: "Alang",
				link: "https://github.com/iamsubhranil/Alang",
				desc: "An algorithmic programming language written in C",
			},
			{
				name: "Scroller",
				link: "https://github.com/iamsubhranil/Scroller",
				desc: "An infinite scrolling-based image browser for Android",
			},
		],
	},
	{
		version: "cloud",
		oneliner: "Cloud Technology Enthusiast & Programmer",
		summary:
			"Obsessed Cloud Technology enthusiast with an impressive local and Microsoft Azure homelabs. \
        Dedicated IT support professional with 2 years of experience in managing and maintaining IT \
        infrastructure. Passionate self learnt programmer with experience ranging from building medium \
        sized programming languages to creating an operating system, and everything in between.",
		showcase: [
			{
				name: "Cloud Resume Challenge",
				details: [
					"Created a static web app on Azure with an Azure CDN endpoint",
					"Bound the endpoint to a custom domain with HTTPS",
					"Used Azure Cosmos DB with Table backend to implement a hit counter and wrote Python code to update it",
					"Used Azure Functions to host the Python code and update on each load",
					"Implemented CI/CD using Github Actions to automatically deploy both frontend and backend code on every push to the individual main branches",
				],
			},
			{
				name: "AWS Deployment with Terraform",
				details: [
					"Wrote Terraform scripts to simulate an enterprise on AWS",
					"Created multiple IAM users, departments, and policies for the departments",
					"Deployed multiple EC2 instances for each of the departments",
					"Created S3 buckets and redirected their access logs to a specialized 'logbucket'",
					"Used S3 Lifecycles to implement storage tiers, automatically moving older logs to Glacier storage",
				],
			},
			{
				name: "Scalable Python Application with Kubernetes",
				details: [
					"Used Kubernetes to deploy a high availability Flask application",
					"Configured 9 replicas for the frontend",
					"Used NodePort to expose the frontend and MySQL backend to specific ports on the node",
					"Used Horizontal Pod Autoscaling to automatically rescale the application based on user demand and CPU usage",
					"Used YAML files for all the services, deployments, and the HPA to make the configuration reproducible and automated",
				],
			},
			{
				name: "Home Lab",
				details: [
					"Managing and orchestrating a diverse set of 30+ Docker containers, spanning health check, media management, home automation, and ad-blocking services",
					"Utilizing a two-tiered storage approach with LVM to enhance caching capabilities",
					"Configured a robust reverse proxy system with Nginx and Let's Encrypt for secure SSL connections",
					"Implemented Authelia as a Single Sign-On (SSO) solution, enhancing security through two-factor authentication using Microsoft Authenticator",
					"Set up alerts and monitoring using Prometheus and Grafana for system health and performance tracking",
					"Established remote server access and extended network accessibility via Wireguard, facilitated by a VPS hosted on Microsoft Azure",
				],
			},
			{
				name: "Microsoft Azure Hacking Lab",
				details: [
					"Built a hacking lab in Azure to simulate an enterprise network and vulnerable machines",
					"Deployed a Windows 2022 domain controller and two Windows 11 domain-connected machines using Azure Virtual Machines",
					"Utilized Azure Monitor to monitor the health of the machines and create alerts",
				],
			},
		],
		others: [
			{
				name: "MyOS",
				link: "https://github.com/iamsubhranil/MyOS",
				desc: "A tiny, tiny operating system written in C++",
			},
			{
				name: "Next",
				link: "https://github.com/iamsubhranil/Next",
				desc: "A familiar, fast programming language",
			},
			{
				name: "OpenWRTSnapshot",
				link: "https://github.com/iamsubhranil/OpenWRTSnapshot",
				desc: "A collection of scripts to build, install, and automatically set up a customized version of OpenWRT for my home routers",
			},
			{
				name: "AutoCar",
				link: "https://github.com/iamsubhranil/AutoCar",
				desc: "A self-taught racing game powered by neural networks and a genetic algorithm written in Python",
			},
			{
				name: "ThinkDifferent",
				link: "https://github.com/iamsubhranil/ThinkDifferent",
				desc: "A music player written in Java",
			},
			{
				name: "The8085",
				link: "https://github.com/iamsubhranil/The8085_v2",
				desc: "An 8085 emulator written in C",
			},
		],
	},
];
