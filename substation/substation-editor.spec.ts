/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, fixture, html } from '@open-wc/testing';

import { SinonSpy, spy } from 'sinon';

import { isRemove } from '@openscd/open-scd-core';

import { substationDoc } from '../substation.testfiles.js';

import './substation-editor.js';
import type { SubstationEditor } from './substation-editor.js';

const subSt = new DOMParser()
  .parseFromString(substationDoc, 'application/xml')
  .querySelector('Substation[name="testSubst1"]')!;

describe('Component for SCL element Substation ', () => {
  let editor: SubstationEditor;

  let eventSpy: SinonSpy;

  beforeEach(async () => {
    editor = await fixture(
      html`<substation-editor
        .element="${subSt}"
        ?showfunctions=${true}
      ></substation-editor>`
    );

    eventSpy = spy();
    window.addEventListener('oscd-edit', eventSpy);
    window.addEventListener('oscd-edit-wizard-request', eventSpy);
    window.addEventListener('oscd-create-wizard-request', eventSpy);
  });

  it('sends a wizard edit request', () => {
    editor.editActionable?.click();

    expect(eventSpy).to.have.been.calledOnce;

    const event = eventSpy.args[0][0];
    expect(event.type).to.equal('oscd-edit-wizard-request');
    expect(event.detail.element).to.equal(subSt);
  });

  it('sends a wizard create request', () => {
    editor.addActionable?.forEach(add => {
      add.click();

      expect(eventSpy).to.have.been.calledOnce;

      const event = eventSpy.args[0][0];
      expect(event.type).to.equal('oscd-create-wizard-request');
      expect(event.detail.parent).to.equal(subSt);
      expect(event.detail.tagName).to.equal(add.value);

      eventSpy.resetHistory(); // individual select
    });
  });

  it('allows to remove an existing Substation element', () => {
    editor.removeActionable?.click();

    expect(eventSpy).to.have.been.calledOnce;

    const event = eventSpy.args[0][0];

    expect(event.type).to.equal('oscd-edit');
    expect(event.detail).to.satisfy(isRemove);
    expect(event.detail.node).to.equal(subSt);
  });
});
