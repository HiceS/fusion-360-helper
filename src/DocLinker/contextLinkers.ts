// code lense (text above line)
// code action ? (action dropdown with lightbulb on left)
// decorater - box round item
// register hover provider
// - Document Selector (applicable document)
// - Hover Provider (hover provider?)

import { 
    Disposable, 
    DocumentSelector, 
    languages, 
    Hover,
    ExtensionContext, 
    CancellationToken, 
    HoverProvider, 
    Position, 
    ProviderResult, 
    TextDocument, 
    MarkdownString, 
    Uri,
    commands,
    env,
} from "vscode";

import { DocumentationPanel } from "./docsPanel";

export function configureDocumentionLinker(context: ExtensionContext){
    const _docsPanel: DocumentationPanel = new DocumentationPanel(context);
    const _opener: URIOpener = new URIOpener(context);
	const _hover: LinkerHover = new LinkerHover(context);
	const _docButton: LinkerMenu = new LinkerMenu(context);
}

class LinkerHover {

    private pyDocSelector: DocumentSelector = { scheme: 'file', language: 'python' };
    private fusionHoverProvider: FusionHoverProvider | undefined;

    public constructor(context: ExtensionContext){
        // incase I want more control over this later
        this.fusionHoverProvider = new FusionHoverProvider();

        let hoverDisposable: Disposable = languages.registerHoverProvider(
            this.pyDocSelector,
            this.fusionHoverProvider
        );

        context.subscriptions.push(hoverDisposable);
    }
}

class LinkerMenu {
    private static readonly viewType = "F360 Help Document";

    public constructor(context: ExtensionContext){
        let commandDisp: Disposable = commands.registerCommand(
            "fusion-360-helper.docs.open",
            openHelp,
        );

        context.subscriptions.push(commandDisp);
    }
}

class URIOpener {
    public constructor(context: ExtensionContext){
        let commandDisp: Disposable = commands.registerCommand(
            "fusion-360-helper.docs.openURI",
            openURLWithString
        );

        context.subscriptions.push(commandDisp);
    }
}

class FusionHoverProvider implements HoverProvider{
    provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        console.debug(word);

        if(word) {
            const commentCommandUri = Uri.parse(`command:fusion-360-helper.docs.internalPanel?${encodeURIComponent(JSON.stringify(word))}`);
            const contents = new MarkdownString(`[Go To Help Documentation](${commentCommandUri})`);
            contents.isTrusted = true;
            return new Hover(contents);
        }

        return null;
        
    }
}

function generateURIFromObject(item: string, line: string): Uri {
    const commentCommandUri = Uri.parse('https://help.autodesk.com/view/fusion360/ENU/?guid=GUID-A92A4B10-3781-4925-94C6-47DA85A4F65A');
    return commentCommandUri;
}

function openURL(url: Uri){
    env.openExternal(url);
}

function openURLWithString(strObj: string){
    env.openExternal(Uri.parse("https://help.autodesk.com/view/fusion360/ENU/?contextId=" + strObj));
}

function openHelp(){
    env.openExternal(Uri.parse('https://help.autodesk.com/view/fusion360/ENU/?guid=GUID-A92A4B10-3781-4925-94C6-47DA85A4F65A'));
}
