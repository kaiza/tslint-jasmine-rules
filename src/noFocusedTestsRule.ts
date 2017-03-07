import * as ts from "typescript";
import * as tslint from "tslint";

export class Rule extends tslint.Rules.AbstractRule {
  public static FAILURE_STRING = "Focused test (fit or fdescribe)";
  public static PROHIBITED = ["fdescribe", "fit"];

  public apply(sourceFile: ts.SourceFile): tslint.RuleFailure[] {
    return this.applyWithWalker(new NoFocusedTestsWalker(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class NoFocusedTestsWalker extends tslint.RuleWalker {
  public visitCallExpression(node: ts.CallExpression) {
    let regex = new RegExp("^(" + Rule.PROHIBITED.join("|") + ")$");
    let match = node.expression.getText().match(regex);

    if (match) {
      // create a failure at the current position
      this.addFailure(this.createFailure(node.getStart(), match[0].length, Rule.FAILURE_STRING));
    }

    // call the base version of this visitor to actually parse this node
    super.visitCallExpression(node);
  }
}
