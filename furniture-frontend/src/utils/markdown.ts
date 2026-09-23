export const stripMarkdown = (md: string): string => {
    return md
        .replace(/^#{1,6}\s+/gm, '')       // заголовки
        .replace(/\*\*(.+?)\*\*/g, '$1')   // bold
        .replace(/\*(.+?)\*/g, '$1')       // italic
        .replace(/^\s*[-*]\s+/gm, '')      // списки
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')// ссылки
        .replace(/`(.+?)`/g, '$1')         // inline code
        .replace(/\n+/g, ' ')              // переносы
        .trim();
};
