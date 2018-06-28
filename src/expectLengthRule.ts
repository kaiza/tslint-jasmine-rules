import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "Length check required (e.g. 'expect(xy.length).toBeGreaterThan(0);' )";
  public static ITERATOR_METHODS = ["forEach"];

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new ExpectLengthWalker(sourceFile, this.ruleName, new Set(this.ruleArguments.map(String))));
  }
}

// tslint:disable:max-line-length
// tslint:disable-next-line:max-classes-per-file
class ExpectLengthWalker extends Lint.AbstractWalker<Set<string>> {
  private usages: Map<ts.Identifier, tsutils.VariableInfo>;
  private isInTestFile = false;

  constructor(sourceFile: ts.SourceFile, ruleName: string, options: Set<string>) {
    super(sourceFile, ruleName, options);
    this.isInTestFile = sourceFile.fileName.includes("/test/")
                        || sourceFile.fileName.includes("/e2e/")
                        || sourceFile.fileName.endsWith("spec.ts");

    if (this.isInTestFile) {
      this.usages = tsutils.collectVariableUsage(this.getSourceFile());
    }
  }

  public walk(sourceFile: ts.SourceFile) {
    const cb = (node: ts.Node): void => {
        if (node.kind === ts.SyntaxKind.CallExpression) {
            this.visitCallExpression(node as ts.CallExpression);
            return ts.forEachChild(node, cb);
        } else {
            // Continue rescursion: call function `cb` for all children of the current node.
            return ts.forEachChild(node, cb);
        }
    };
    return ts.forEachChild(sourceFile, cb);
}

  public visitCallExpression(node: ts.CallExpression) {
    if (!this.isInTestFile) { return; }

    const memberExpressionCalled = node.expression.getChildCount() === 3
                                    && node.expression.getChildAt(0).kind === ts.SyntaxKind.Identifier;
    if (memberExpressionCalled) {
        const callee: ts.Identifier = node.expression.getChildAt(0) as ts.Identifier;
        const methodName: string = node.expression.getChildAt(2).getText();

        if (Rule.ITERATOR_METHODS.indexOf(methodName) >= 0 && !this.isLengthExpectedFor(callee)) {
          this.addFailureAt(callee.getStart(), callee.getText().length, Rule.FAILURE_STRING);
        }
    }
  }

  private isLengthExpectedFor(callee: ts.Identifier) {
    let found = false;
    this.usages.forEach((value) => {
      value.uses.forEach((use) => {
        const usage = use.location.parent.parent.getText();
        if (usage === "expect(" + callee.getText() + ".length)") {
          found = true;
        }
      });
    });
    return found;
  }
}
