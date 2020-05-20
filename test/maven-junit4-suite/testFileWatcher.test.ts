// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { commands, TextDocument, window, workspace, extensions } from 'vscode';
import { Uris, sleep } from '../shared';
import { testFileWatcher } from '../../src/testFileWatcher';
import * as sinon from 'sinon';
import * as assert from 'assert';

suite('Test File Watcher Tests', function() {

    suiteSetup(async function() {
        await extensions.getExtension('vscjava.vscode-java-test')!.activate();
    });

    test("Have debounce functionality", async function() {
        const registerListenersInternalSpy = sinon.spy(testFileWatcher, 'registerListenersInternal');
        const document: TextDocument = await workspace.openTextDocument(Uris.JUNIT4_TEST);
        await window.showTextDocument(document);

        testFileWatcher.registerListeners();
        testFileWatcher.registerListeners();
        testFileWatcher.registerListeners();

        await sleep(5 * 1000 /*ms*/);

        assert.equal(registerListenersInternalSpy.callCount, 1);
    });

    teardown(async function() {
        await commands.executeCommand('workbench.action.closeActiveEditor');
    });
});
