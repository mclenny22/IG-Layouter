"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Show the plugin UI in Figma
figma.showUI(__html__);
// Listen for messages sent from the plugin UI
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === 'create-components') {
        const centerX = figma.viewport.center.x;
        const centerY = figma.viewport.center.y;
        // Load required fonts
        yield Promise.all([
            figma.loadFontAsync({ family: "Inter", style: "Regular" }),
            figma.loadFontAsync({ family: "Regola Pro", style: "Regular" })
        ]);
        // Initialize and setup headline text
        const headlineText = figma.createText();
        headlineText.name = "Headline";
        headlineText.characters = msg.headline || "Headline";
        headlineText.fontSize = 150;
        headlineText.x = centerX - (headlineText.width / 2);
        headlineText.y = centerY - 200;
        headlineText.fontName = { family: "Regola Pro", style: "Regular" };
        // Initialize and setup caption text
        const captionText = figma.createText();
        captionText.name = "Caption";
        captionText.characters = "Caption";
        captionText.fontSize = 100;
        captionText.x = centerX - (captionText.width / 2);
        captionText.y = centerY + 100;
        captionText.fontName = { family: "Regola Pro", style: "Regular" };
        // Setup the layout frame for briefing
        const briefingLayout = figma.createFrame();
        briefingLayout.name = "Briefing";
        briefingLayout.layoutMode = "VERTICAL";
        briefingLayout.primaryAxisSizingMode = "AUTO";
        briefingLayout.counterAxisSizingMode = "AUTO";
        briefingLayout.itemSpacing = 100;
        briefingLayout.appendChild(headlineText);
        briefingLayout.appendChild(captionText);
        // Determine design component dimensions and create it
        let designWidth, designHeight;
        if (msg.size === 'IG Feed') {
            designWidth = 1080;
            designHeight = 1080;
        }
        else {
            designWidth = 1080;
            designHeight = 1920;
        }
        const designComponent = figma.createComponent();
        designComponent.name = "Design";
        designComponent.resize(designWidth, designHeight);
        designComponent.clipsContent = true;
        // Additional properties like background color and positioning
        // Add padding and rounded corners to the main layout frame
        const mainLayout = figma.createFrame();
        mainLayout.name = "Main Layout";
        mainLayout.layoutMode = "HORIZONTAL";
        mainLayout.primaryAxisSizingMode = "AUTO";
        mainLayout.counterAxisSizingMode = "AUTO";
        mainLayout.itemSpacing = 200;
        mainLayout.paddingTop = 150;
        mainLayout.paddingRight = 150;
        mainLayout.paddingBottom = 150;
        mainLayout.paddingLeft = 150;
        mainLayout.cornerRadius = 100;
        mainLayout.appendChild(briefingLayout);
        mainLayout.appendChild(designComponent);
        figma.currentPage.appendChild(mainLayout);
        // If a node is selected, add an instance of the Design component to it
        const selectedNode = figma.currentPage.selection[0];
        if (selectedNode && selectedNode.type === 'FRAME' && selectedNode.layoutMode !== 'NONE') {
            const designInstance = designComponent.createInstance();
            designInstance.resize(1080, 1080); // Fixed size for the instance
            selectedNode.appendChild(designInstance);
        }
        // Select the newly created layout in the Figma file
        figma.currentPage.selection = [mainLayout];
        // Close the plugin once everything is done
        figma.closePlugin();
    }
});
