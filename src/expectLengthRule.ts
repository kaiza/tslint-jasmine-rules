import * as Lint from "tslint";
import * as tsutils from "tsutils";
import {VariableInfo} from "tsutils";
import * as ts from "typescript";

function some<T>(iterator: IterableIterator<T>, predicate: (value: T) => boolean): boolean {
  let next;
  while (!(next = iterator.next()).done) {
    if (predicate(next.value)) {
      return true;
    }
  }

  return false;
}

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING =
    "Length check required (e.g. 'expect(xy.length).toBeGreaterThan(0);' )";
  public static ITERATOR_METHODS = ["forEach"];

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new ExpectLengthWalker(sourceFile, this.ruleName, new Set(this.ruleArguments.map(String))),
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
class ExpectLengthWalker extends Lint.AbstractWalker<Set<string>> {
  private usages: Map<ts.Identifier, tsutils.VariableInfo>;
  private readonly isInTestFile: boolean;
  private minimalPattern = "(\/test\/)";
  private defaultPattern = "(\/e2e\/)|(spec\.ts$)";
  private fileNamePattern = new RegExp(this.minimalPattern + "|" + this.defaultPattern);

  constructor(
    sourceFile: ts.SourceFile,
    ruleName: string,
    options: Set<string>,
  ) {
    super(sourceFile, ruleName, options);
    this.isInTestFile = this.fileNamePattern.test(sourceFile.fileName);

    if (this.isInTestFile) {
      this.usages = tsutils.collectVariableUsage(this.getSourceFile());
    }
  }

  public walk(sourceFile: ts.SourceFile) {
    const cb = (node: ts.Node): void => {
      if (node.kind === ts.SyntaxKind.CallExpression) {
        this.visitCallExpression(node as ts.CallExpression);
      }
      return ts.forEachChild(node, cb);
    };
    return ts.forEachChild(sourceFile, cb);
  }

  public visitCallExpression(node: ts.CallExpression) {
    if (!this.isInTestFile) {
      return;
    }

    const memberExpressionCalled =
      node.expression.getChildCount() === 3 &&
      node.expression.getChildAt(0).kind === ts.SyntaxKind.Identifier;

    if (memberExpressionCalled) {
      const callee = node.expression.getChildAt(0) as ts.Identifier;
      const methodName = node.expression.getChildAt(2).getText();
      const iteratingMethod = Rule.ITERATOR_METHODS.indexOf(methodName) >= 0;

      if (iteratingMethod && !this.isLengthExpectedFor(callee)) {
        this.addFailureAt(callee.getStart(), callee.getText().length, Rule.FAILURE_STRING);
      }
    }
  }

  private isLengthExpectedFor(callee: ts.Identifier) {
    return some<VariableInfo>(this.usages.values(), (value) => {
      return value.uses.some((use) => {
        const usage = use.location.parent.parent.getText();
        return usage === `expect(${callee.getText()}.length)`;
      });
    });
  }
}
