function getUniqueSelector(element) {
    if (element.id) {
        return {selectorType: "ID", selector: element.id }
    }

    let path = '';
    while (element !== document.body) {
        if (!element.parentNode) {
            break;
        }

        let idx = Array.from(element.parentNode.children)
            .filter(e => e.tagName === element.tagName)
            .indexOf(element) + 1;

        idx > 1 ? (path = `/${element.tagName.toLowerCase()}[${idx}]${path}`)
            : (path = `/${element.tagName.toLowerCase()}${path}`);

        element = element.parentNode;
    }

    return {selectorType: "XPATH", selector: `/html/body${path}`};
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}