/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// Requires node >= 7.6

import { Analyzer, Feature, FSUrlLoader, Property, Method, PolymerElementMixin } from 'polymer-analyzer';

import {Analysis} from 'polymer-analyzer/lib/model/model';

const isInTestsRegex = /(\b|\/|\\)(test[s]?)(\/|\\)/;
const isTest = (f: Feature) => f.sourceRange && isInTestsRegex.test(f.sourceRange.file);

export interface Options {
  entrypoint?: string;
  directory?: string;
}

export function generateDeclarations(options: Options = {}):Promise<string> {
  const urlLoader = new FSUrlLoader(options.directory);
  const analyzer = new Analyzer({urlLoader});

  let analysisPromise: Promise<Analysis>;

  if (options.entrypoint) {
    analysisPromise = analyzer.analyze([options.entrypoint]);
  } else {
    analysisPromise = analyzer.analyzePackage();
  }

  return analysisPromise.then(generatePackage);
}

function generatePackage(pkg: Analysis):string {
  const declarations:string[] = [];

  const features = pkg.getFeatures();
  for (const feature of features) {
    if (isTest(feature)) {
      continue;
    }

    if (feature.kinds.has('element-mixin')) {
      genMixinDeclaration(feature as PolymerElementMixin, declarations);
    }
  }

  return declarations.join('\n');
}

function genMixinDeclaration(mixin: PolymerElementMixin, declarations: string[]) {
  const {name, namespace} = getNamespaceAndName(mixin.name);
  let mixinName = `${namespace}_${name}`;
  let mixinDesc = ['/**', '* @interface'];

  if (mixin.mixins && mixin.mixins.length > 0) {
    mixin.mixins.forEach((m) => {
      const {name, namespace} = getNamespaceAndName(m.identifier);
      mixinDesc.push(`* @extends {${namespace}_${name}}`);
    });
  }

  mixinDesc.push('*/', `function ${mixinName}(){}`);

  mixin.properties.forEach((property) => {
    const propertyText = genProperty(mixinName, property);
    if (propertyText) {
      mixinDesc.push(propertyText);
    }
  });

  mixin.methods.forEach((method) => {
    const methodText = genMethod(mixinName, method);
    if (methodText) {
      mixinDesc.push(methodText);
    }
  });

  mixin.staticMethods.forEach((method) => {
    const methodText = genMethod(mixinName, method, true);
    if (methodText) {
      mixinDesc.push(methodText);
    }
  })

  declarations.push(mixinDesc.join('\n'));
}

function genProperty(mixinName: string, property: Property): string {
  if (property.inheritedFrom) {
    return '';
  }
  return `/** @type {${property.type}} */\n${mixinName}.prototype.${property.name};\n`;
}

function genMethod(mixinName: string, method: Method, isStatic = false): string {
  if (method.privacy === 'private' || method.inheritedFrom) {
    return '';
  }
  let override = false;
  if (method.jsdoc && method.jsdoc.tags.some(t => t.title === 'override')) {
    override = true;
  }
  let out = ['/**'];
  let docParams = true;
  if (override) {
    out.push('* @override');
    docParams = Boolean(method.jsdoc && method.jsdoc.tags.some(t => t.title === 'param'));
  }
  if (method.params && docParams) {
    method.params.forEach(p => out.push(genParameter(p)));
  }
  const returnType = method.return && method.return.type;
  if (returnType) {
    out.push(`* @return {${returnType}}`);
  }
  if (docParams && (!method.params || !method.params.length) && !returnType) {
    out.push('* @return {undefined}');
  }
  out.push('*/');
  const paramText = method.params
    ? method.params.map((p) => cleanVarArgs(p.name)).join(', ')
    : '';
  out.push(`${mixinName}${!isStatic ? '.prototype' : ''}.${method.name} = function(${paramText}){};`);
  return out.join('\n');
}

function cleanVarArgs(name: string) {
  if (name.startsWith('...')) {
    return name.slice(3);
  }
  return name;
}

function genParameter(parameter: { name: string; type?: string; description?: string }) {
  let implicitType = parameter.name.startsWith('...') ? '...*' : '*';
  return `* @param {${parameter.type || implicitType}} ${cleanVarArgs(parameter.name)} ${parameter.description || ''}`;
}

function getNamespaceAndName(name: string): { name?: string, namespace?: string } {
  if (typeof name === 'string') {
    const lastDotIndex = name.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return {
        name: name.substring(lastDotIndex + 1, name.length),
        namespace: name.substring(0, lastDotIndex)
      };
    }
  }
  return { name };
}