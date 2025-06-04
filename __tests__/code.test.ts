class FigmaMock {
  ui = { onmessage: null as any };
  viewport = { center: { x: 0, y: 0 } };
  currentPage = { selection: [] as any[] };
  createdComponents: any[] = [];
  showUI = jest.fn();
  loadFontAsync = jest.fn(() => Promise.resolve());
  createText() {
    return {
      name: '',
      characters: '',
      fontSize: 0,
      x: 0,
      y: 0,
      fontName: { family: '', style: '' },
      width: 0,
      height: 0,
    };
  }
  createFrame() {
    return {
      name: '',
      layoutMode: '',
      primaryAxisSizingMode: '',
      counterAxisSizingMode: '',
      itemSpacing: 0,
      x: 0,
      y: 0,
      appendChild: jest.fn(),
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      cornerRadius: 0,
    };
  }
  createComponent() {
    const component: any = {
      name: '',
      width: 0,
      height: 0,
      resize(w: number, h: number) {
        this.width = w;
        this.height = h;
      },
      clipsContent: false,
      x: 0,
      y: 0,
      fills: null,
      createInstance() {
        const inst: any = { width: 0, height: 0 };
        inst.resize = function(w: number, h: number) {
          this.width = w;
          this.height = h;
        };
        return inst;
      },
      appendChild: jest.fn(),
    };
    this.createdComponents.push(component);
    return component;
  }
  closePlugin = jest.fn();
}

describe('create-components', () => {
  let figma: any;

  beforeEach(() => {
    figma = new FigmaMock();
    (global as any).figma = figma;
    (global as any).__html__ = '';
    jest.resetModules();
    require('../code.ts');
  });

  test('creates design component sized 1080x1080 for IG Feed', async () => {
    await figma.ui.onmessage({ type: 'create-components', size: 'IG Feed', headline: 'Test' });
    const design = figma.createdComponents.find((c: any) => c.name === 'Design') || figma.createdComponents[0];
    expect(design.width).toBe(1080);
    expect(design.height).toBe(1080);
  });
});
