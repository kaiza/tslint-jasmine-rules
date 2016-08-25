import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "Focused test (fit or fdescribe)";
  public static PROHIBITED = ["fdescribe", "fit"];

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoFocusedTestsWalker(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class NoFocusedTestsWalker extends Lint.RuleWalker {
  public visitCallExpression(node: ts.CallExpression) {
    let regex = new RegExp("^(" + Rule.PROHIBITED.join("|") + ")$");

    if (node.expression.getText().match(regex)) {
      // create a failure at the current position
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
    }

    // call the base version of this visitor to actually parse this node
    super.visitCallExpression(node);
  }
}
