"use strict";

// Display the plugin UI defined in ui.html
figma.showUI(__html__);

// Listen for messages sent from the UI
figma.ui.onmessage = async msg => {
    // Handle creation of new components based on UI instructions
    if (msg.type === 'create-components') {
        const centerX = figma.viewport.center.x;
        const centerY = figma.viewport.center.y;

        // Load fonts required for text elements
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        await figma.loadFontAsync({ family: "Regola Pro", style: "Regular" });

        // Initialize and set up 'Headline' text element
        const headlineText = figma.createText();
        headlineText.name = "Headline";
        headlineText.characters = msg.headline || "Headline"; 
        headlineText.fontSize = 150;
        headlineText.x = centerX - (headlineText.width / 2);
        headlineText.y = centerY - 200;
        headlineText.fontName = { family: "Regola Pro", style: "Regular" };

        // Initialize and set up 'Caption' text element
        const captionText = figma.createText();
        captionText.name = "Caption";
        captionText.characters = "Caption";
        captionText.fontSize = 100;
        captionText.x = centerX - (captionText.width / 2);
        captionText.y = centerY + 100;
        captionText.fontName = { family: "Regola Pro", style: "Regular" };

        // Determine the size for 'Design' component based on UI selection
        let designWidth, designHeight;
        switch (msg.size) {
            case 'IG Feed':
                designWidth = 1080;
                designHeight = 1080;
                break;
            case 'IG Reel':
                designWidth = 1080;
                designHeight = 1920;
                break;
            default:
                designWidth = 1080; // Default width
                designHeight = 1080; // Default height (square, like IG Feed)
                break;
        }

        // Initialize and set up the 'Design' component
        const designComponent = figma.createComponent();
        designComponent.name = "Design";
        designComponent.resize(designWidth, designHeight);
        designComponent.clipsContent = true; // Ensure clipping of out-of-bound content
        designComponent.x = centerX - (designComponent.width / 2);
        designComponent.y = centerY + 200;
        designComponent.fills = [{ type: 'SOLID', color: { r: Math.random(), g: Math.random(), b: Math.random() } }];

        // Append 'Headline' and 'Caption' to 'Briefing' layout and set its properties
        const briefingLayout = figma.createFrame();
        briefingLayout.layoutMode = "VERTICAL";
        briefingLayout.primaryAxisSizingMode = "AUTO";
        briefingLayout.counterAxisSizingMode = "AUTO";
        briefingLayout.itemSpacing = 100;
        briefingLayout.name = "Briefing";
        briefingLayout.x = centerX - (briefingLayout.width / 2);
        briefingLayout.y = centerY - 50;
        briefingLayout.appendChild(headlineText);
        briefingLayout.appendChild(captionText);

        // Initialize and set up the 'Post Briefing'
        const mainLayout = figma.createFrame();
        mainLayout.layoutMode = "HORIZONTAL";
        mainLayout.primaryAxisSizingMode = "AUTO";
        mainLayout.counterAxisSizingMode = "AUTO";
        mainLayout.itemSpacing = 200;
        mainLayout.name = "Post Briefing";
        mainLayout.paddingTop = 150;
        mainLayout.paddingRight = 150;
        mainLayout.paddingBottom = 150;
        mainLayout.paddingLeft = 150;
        mainLayout.cornerRadius = 100;
        mainLayout.x = centerX - (mainLayout.width / 2);
        mainLayout.y = centerY + 600;
        mainLayout.appendChild(briefingLayout);
        mainLayout.appendChild(designComponent);

        // Check if a frame is selected to insert the 'Design' instance
        const selectedNode = figma.currentPage.selection[0];
        if (selectedNode && selectedNode.type === 'FRAME' && selectedNode.layoutMode !== 'NONE') {
            const designInstance = designComponent.createInstance();
            designInstance.resize(1080, 1080); // Force 'Design' instance size to 1080x1080
            selectedNode.appendChild(designInstance);
        }

        // Set Figma's current selection to the 'Briefing' layout
        figma.currentPage.selection = [briefingLayout];

        // Close the plugin after execution
        figma.closePlugin();
    }
};
