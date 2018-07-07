import * as Lint from "tslint";
import * as ts from "typescript";
import {CallExpressionWalker} from "./callExpressionWalker";

export class Rule extends Lint.Rules.AbstractRule {
  private static readonly FAILURE_STRING = "Disabled test (xit or xdescribe)";
  private static readonly PROHIBITED = ["xdescribe", "xit"];
  private static readonly REGEX = new RegExp("^(" + Rule.PROHIBITED.join("|") + ")$");

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
        new CallExpressionWalker(sourceFile, this.getOptions(), Rule.REGEX, Rule.FAILURE_STRING));
  }
}
