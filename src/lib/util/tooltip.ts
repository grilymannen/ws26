import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';
import tippy from 'tippy.js';

import type { Attachment } from 'svelte/attachments';

export function tooltip(content: string): Attachment {
	return (element) => {
		const tooltip = tippy(element, { content, theme: 'light-border' });
		return tooltip.destroy;
	};
}
