import * as Lint from "tslint";
import * as tsutils from "tsutils";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "Length check for %s required";
  public static ITERATOR_METHOD = ["forEach"];

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ExpectLengthWalker(sourceFile, this.getOptions()));
  }
}

// tslint:disable:max-line-length
// tslint:disable-next-line:max-classes-per-file
class ExpectLengthWalker extends Lint.RuleWalker {
  private usages: Map<ts.Identifier, tsutils.VariableInfo>;

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
    this.usages = tsutils.collectVariableUsage(this.getSourceFile());
  }

  public visitCallExpression(node: ts.CallExpression) {
    const memberExpressionCalled = node.expression.getChildCount() === 3
                                    && node.expression.getChildAt(0).kind === ts.SyntaxKind.Identifier;
    if (memberExpressionCalled) {
        const callee: ts.Identifier = node.expression.getChildAt(0) as ts.Identifier;
        const methodName: string = node.expression.getChildAt(2).getText();

        if (Rule.ITERATOR_METHOD.indexOf(methodName) >= 0 && !this.isLengthExpectedFor(callee)) {
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
