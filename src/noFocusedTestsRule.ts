import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "Focused test (fit or fdescribe)";
  public static PROHIBITED = ["fdescribe", "fit"];

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoFocusedTestsWalker(sourceFile, this.getOptions()));
  }
}

const regex = new RegExp("^(" + Rule.PROHIBITED.join("|") + ")$");

// tslint:disable-next-line:max-classes-per-file
class NoFocusedTestsWalker extends Lint.RuleWalker {
  private arguments: string[];

  constructor(sourceFile: ts.SourceFile, options) {
    super(sourceFile, options);
    this.arguments = options.ruleArguments;
  }

  public visitCallExpression(node: ts.CallExpression) {
    const match = node.expression.getText().match(regex);

    if (match) {
      let fix;
      if (this.arguments.indexOf("fixable") > -1) {
        fix = Lint.Replacement.deleteText(node.getStart(), 1);
      }
      this.addFailureAt(node.getStart(), match[0].length, Rule.FAILURE_STRING, fix);
    }

    super.visitCallExpression(node);
  }
}
