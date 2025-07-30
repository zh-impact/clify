import { Project, ts } from "ts-morph";

const project = new Project({
  tsConfigFilePath: undefined,
  compilerOptions: {
    allowJs: true,
    declaration: false,
    checkJs: true,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
  },
});

type InterfaceResult = Map<
  string,
  {
    input?: { name?: string; type?: string }[];
    output?: string;
  }
>;

export function extractTypes(filepath: string) {
  const sourceFile = project.addSourceFileAtPath(filepath);
  const interfaceDeclarations = sourceFile.getExportedDeclarations();

  const results: InterfaceResult = new Map();

  interfaceDeclarations.forEach((decls, name) => {
    for (const decl of decls) {
      const kind = decl.getKind();

      const isFuncDecl =
        kind === ts.SyntaxKind.FunctionDeclaration ||
        kind === ts.SyntaxKind.VariableDeclaration;

      if (!isFuncDecl) continue;

      const type = decl.getType();
      const signature = type.getCallSignatures();
      if (signature.length === 0) continue;

      const sig = signature[0];
      const params = sig?.getParameters().map((param) => {
        const paramDecl = param.getDeclarations()[0];
        return {
          name: param?.getName(),
          type: paramDecl?.getType().getText(),
        };
      });

      const returnType = sig?.getReturnType().getText();

      results.set(name, {
        input: params,
        output: returnType,
      });
    }
  });

  return results;
}
