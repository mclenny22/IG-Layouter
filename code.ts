// Show the plugin UI in Figma
figma.showUI(__html__);

// Listen for messages sent from the plugin UI
figma.ui.onmessage = async (msg: { type: string; headline?: string; size?: 'IG Feed' | 'IG Reel' }): Promise<void> => {
    if (msg.type === 'create-components') {
        const centerX: number = figma.viewport.center.x;
        const centerY: number = figma.viewport.center.y;

        // Load required fonts
        await Promise.all([
            figma.loadFontAsync({ family: "Inter", style: "Regular" }),
            figma.loadFontAsync({ family: "Regola Pro", style: "Regular" })
        ]);

        // Initialize and set up headline text
        const headlineText: TextNode = figma.createText();
        headlineText.name = "Headline";
        headlineText.characters = msg.headline || "Headline";
        headlineText.fontSize = 150;
        headlineText.x = centerX - (headlineText.width / 2);
        headlineText.y = centerY - 200;
        headlineText.fontName = { family: "Regola Pro", style: "Regular" };

        // Initialize and set up caption text
        const captionText: TextNode = figma.createText();
        captionText.name = "Caption";
        captionText.characters = "Caption";
        captionText.fontSize = 100;
        captionText.x = centerX - (captionText.width / 2);
        captionText.y = centerY + 100;
        captionText.fontName = { family: "Regola Pro", style: "Regular" };

        // Set up the layout frame for briefing
        const briefingLayout: FrameNode = figma.createFrame();
        briefingLayout.name = "Briefing";
        // Additional properties like layout mode, sizing mode, and item spacing

        // Determine design component dimensions and create it
        let designWidth: number, designHeight: number;
        if (msg.size === 'IG Feed') {
            designWidth = 1080;
            designHeight = 1080;
        } else {
            designWidth = 1080;
            designHeight = 1920;
        }
        const designComponent: ComponentNode = figma.createComponent();
        designComponent.name = "Design";
        designComponent.resize(designWidth, designHeight);
        designComponent.clipsContent = true;
        // Additional properties like background color and positioning

        // Add padding and rounded corners to the main layout frame
        const mainLayout: FrameNode = figma.createFrame();
        mainLayout.name = "Main Layout";
        // Additional properties for layout, padding, and corner radius

        // If a node is selected, add an instance of the Design component to it
        const selectedNode: FrameNode | undefined = figma.currentPage.selection[0] as FrameNode;
        if (selectedNode && selectedNode.type === 'FRAME' && selectedNode.layoutMode !== 'NONE') {
            const designInstance: InstanceNode = designComponent.createInstance();
            designInstance.resize(1080, 1080); // Fixed size for the instance
            selectedNode.appendChild(designInstance);
        }

        // Select the newly created layout in the Figma file
        figma.currentPage.selection = [mainLayout];

        // Close the plugin once everything is done
        figma.closePlugin();
    }
};
