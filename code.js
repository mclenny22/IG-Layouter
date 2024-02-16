"use strict";

figma.showUI(__html__);

figma.ui.onmessage = async msg => {
    if (msg.type === 'create-components') {
        // Get the center coordinates of the current view
        const centerX = figma.viewport.center.x;
        const centerY = figma.viewport.center.y;
        
        // Load the Inter font asynchronously
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        await figma.loadFontAsync({ family: "Regola Pro", style: "Regular" });

        // Create a text box "Headline" with font size 150 and content from user input
        const headlineText = figma.createText();
        headlineText.name = "Headline";
        headlineText.characters = msg.headline || "Headline"; // Use user input or default to "Headline"
        headlineText.resize(1500, headlineText.height);
        headlineText.fontSize = 150;
        headlineText.x = centerX - (headlineText.width / 2); // Center horizontally
        headlineText.y = centerY - 200; // Position above the center
        headlineText.fontName = { family: "Regola Pro", style: "Regular" }; // Use Inter font

        // Create a text box "Caption" with font size 100
        const captionText = figma.createText();
        captionText.name = "Caption";
        captionText.characters = "Caption"; // Default to "Caption"
        captionText.resize(1500, captionText.height);
        captionText.fontSize = 100;
        captionText.x = centerX - (captionText.width / 2); // Center horizontally
        captionText.y = centerY + 100; // Position below the center
        captionText.fontName = { family: "Regola Pro", style: "Regular" }; // Use Inter font
        
        // Create an auto layout "Briefing" with vertical direction and gap of 100
        const briefingLayout = figma.createFrame();
        briefingLayout.layoutMode = "VERTICAL";
        briefingLayout.primaryAxisSizingMode = "AUTO";
        briefingLayout.counterAxisSizingMode = "AUTO";
        briefingLayout.itemSpacing = 100;
        briefingLayout.name = "Briefing";
        briefingLayout.x = centerX - (briefingLayout.width / 2); // Center horizontally
        briefingLayout.y = centerY - 50; // Center vertically
        briefingLayout.resize(1500, briefingLayout.height); // Resize to fit text boxes
        briefingLayout.appendChild(headlineText);
        briefingLayout.appendChild(captionText);
        
        // Create a component "Design" with size 1080px by 1080px and random background color
        const designComponent = figma.createComponent();
        designComponent.name = "Design";
        designComponent.resize(1080, 1080);
        designComponent.x = centerX - (designComponent.width / 2); // Center horizontally
        designComponent.y = centerY + 200; // Position below the briefing layout
        // Generate random color for the component background
        const randomColor = {
            r: Math.random(),
            g: Math.random(),
            b: Math.random(),
        };
        designComponent.fills = [{ type: 'SOLID', color: randomColor }];
        
        // Create an auto layout "Main Layout" with horizontal direction and gap of 200
        const mainLayout = figma.createFrame();
        mainLayout.layoutMode = "HORIZONTAL";
        mainLayout.primaryAxisSizingMode = "AUTO";
        mainLayout.counterAxisSizingMode = "AUTO";
        mainLayout.itemSpacing = 200;
        mainLayout.name = "Main Layout";
        mainLayout.x = centerX - (mainLayout.width / 2); // Center horizontally
        mainLayout.y = centerY + 600; // Position below the design component
        mainLayout.cornerRadius = 100; // Set border radius to 100
        mainLayout.paddingLeft = 150; // Add left padding of 150
        mainLayout.paddingRight = 150; // Add right padding of 150
        mainLayout.paddingTop = 150; // Add top padding of 150
        mainLayout.paddingBottom = 150; // Add bottom padding of 150
        mainLayout.appendChild(briefingLayout);
        mainLayout.appendChild(designComponent);
        
        // Get the selected auto layout element
        const selectedNode = figma.currentPage.selection[0];
        if (selectedNode && selectedNode.type === 'FRAME' && selectedNode.layoutMode !== 'NONE') {
            // Create an instance of the "Design" component and add it to the selected auto layout element
            const designInstance = designComponent.createInstance();
            selectedNode.appendChild(designInstance);
        }

        // Select the briefing layout
        figma.currentPage.selection = [briefingLayout];

        
    }
    figma.closePlugin();
};
