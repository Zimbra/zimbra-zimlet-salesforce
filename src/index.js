//Load components from Zimbra
import { createElement, Fragment } from 'preact';
import { Text } from 'preact-i18n';
import { provide } from 'preact-context-provider';
import { withIntl } from './enhancers';
import { MenuItem, GenericMobileUISidebar, GenericMobileUIToolbar } from '@zimbra-client/components'; // Sidebar/Toolbar are so nav menu is accessible in mobile
import { Button } from '@zimbra-client/blocks';
import { useCallback } from 'preact/hooks';

//Load the createMore function from our Zimlet component
import createMore from './components/more';

//Create function by Zimbra convention
export default function Zimlet(context) {
	//Get the 'plugins' object from context and define it in the current scope
	const { plugins, store, zimbraBatchClient } = context;
	const { dispatch, zimletRedux } = store;
	const exports = {};

	exports.init = function init() {
		//Here we load the moreMenu Zimlet item into the UI slot:
		plugins.register('slot::action-menu-mail-more', provide(context)(createMore));
	};

	return exports;
}
