import DS from 'ember-data';
import { filterBy, or } from '@ember/object/computed';

import Class from './class';
import { memberUnion, hasMemberType } from '../utils/computed';

const { attr } = DS;

export default Class.extend({
  isComponent: true,

  yields: attr(),
  arguments: attr(),

  overloadedYields: or('yields', 'inheritedYields'),

  publicArguments: filterBy('arguments', 'access', 'public'),
  privateArguments: filterBy('arguments', 'access', 'private'),
  protectedArguments: filterBy('arguments', 'access', 'protected'),

  allPublicArguments: memberUnion('parentClass.allPublicArguments', 'publicArguments'),
  allPrivateArguments: memberUnion('parentClass.allPrivateArguments', 'privateArguments'),
  allProtectedArguments: memberUnion('parentClass.allProtectedArguments', 'protectedArguments'),

  allArguments: memberUnion('parentClass.allArguments', 'arguments'),

  hasInherited: or(
    'parentClass.overloadedYields.length',
    'parentClass.allArguments.length',
    'parentClass.allAccessors.length',
    'parentClass.allMethods.length',
    'parentClass.allFields.length'
  ),

  hasInternal: or(
    'allAccessors.length',
    'allMethods.length',
    'allFields.length'
  ),

  hasPrivate: or(
    'allPrivateAccessors.length',
    'allPrivateArguments.length',
    'allPrivateMethods.length',
    'allPrivateFields.length'
  ),

  hasProtected: or(
    'allProtectedAccessors.length',
    'allProtectedArguments.length',
    'allProtectedMethods.length',
    'allProtectedFields.length'
  ),

  hasDeprecated: hasMemberType(
    'allAccessors',
    'allArguments',
    'allMethods',
    'allFields',

    function(member) {
      return member.tags && member.tags.find(t => t.name === 'deprecated');
    }
  )
});
