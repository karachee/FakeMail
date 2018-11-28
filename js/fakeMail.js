let editor;

$(function () {
    editor = new Quill('#quill-editor', {
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{'header': 1}, {'header': 2}],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],
                [{'indent': '-1'}, {'indent': '+1'}],
                [{'direction': 'rtl'}],
                [{'header': [1, 2, 3, 4, 5, 6, false]}],
                [{'color': []}, {'background': []}],
                [{'font': []}],
                [{'align': []}],
                ['clean']
            ]
        },
        placeholder: 'Compose a message...',
        theme: 'snow'
    });
});

function vh(v) {
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
}

function submit() {
    let toElement = document.getElementById("to-email");
    let fromElement = document.getElementById("from-email");
    let subjectElement = document.getElementById("subject");
    let contentElement = document.getElementById("content");
    let content = editor.root.innerHTML;

    let form = document.getElementById('fake-mail-form');

    let elements = [toElement, fromElement, subjectElement, contentElement];
    clearErrors(elements);

    if (toElement && fromElement && subjectElement && contentElement && form) {
        contentElement.value = content;

        if (!hasErrors(elements) && content) {

            let sendButton = document.getElementById('send-button');
            if (sendButton) {
                sendButton.classList.add('mail-sent');
            }

            setTimeout(() => {
                addToEmail(toElement.value);
                addFromEmail(fromElement.value);
                form.submit();
            }, 2000);
        }
    }
}

function hasErrors(elements) {
    let hadError = false;
    if (elements) {
        elements.forEach(x => {
            if (!x.value) {
                x.classList.add('invalid');
                hadError = true;
            }
        });
    }

    return hadError;
}

function clearErrors(elements) {
    if (elements) {
        elements.forEach(x => x.classList.remove('invalid'));
    }
}

function addToEmail(toEmailAddress) {
    let toEmails = getToEmails();
    toEmails = (toEmails != null) ? toEmails : {};

    if (!toEmails.hasOwnProperty(toEmailAddress)) {
        toEmails[toEmailAddress] = null;
    }

    localStorage.setItem("toEmails", JSON.stringify(toEmails));

    updateToEmailAutoComplete(toEmails);
}

function addFromEmail(fromEmailAddress) {
    let fromEmails = getFromEmails();
    fromEmails = (fromEmails != null) ? fromEmails : {};

    if (!fromEmails.hasOwnProperty(fromEmailAddress)) {
        fromEmails[fromEmailAddress] = null;
    }

    localStorage.setItem("fromEmails", JSON.stringify(fromEmails));

    updateFromEmailAutoComplete(fromEmails);
}

function updateToEmailAutoComplete(data) {
    $('#to-email').autocomplete({data});
}

function updateFromEmailAutoComplete(data) {
    $('#from-email').autocomplete({data});
}

function handleAttachment(e) {
    let content = e.target['result'];
    if (content) {
        let attachmentContentElement = document.getElementById('attachment-content');
        let attachmentFilenameElement = document.getElementById('attachment-filename');
        let attachmentFilenameTempElement = document.getElementById('attachment-filename-temp');

        if (attachmentContentElement && attachmentFilenameElement && attachmentFilenameTempElement) {
            attachmentContentElement.value = content;
            attachmentFilenameElement.value = attachmentFilenameTempElement.value;
        }
    }
}

function buildModal(elementId, map){
    let element = document.getElementById(elementId);
    if(element && map){
        let className = elementId+'-item';
        let items = Object.keys(map).sort().map(x => createCollectionItem(x, className));
        element.innerHTML = items.join("");

        addClickEventListenersByClassName(className, handleCollectionItemClick);
    }
}

function createCollectionItem(content, className){
    return '<li class="collection-item avatar '+className+'" style="min-height:unset; cursor: pointer;">' +
        '<i class="material-icons circle blue-grey">account_circle</i>' +
        '<span class="title" style="line-height: 45px;">'+content+'</span>' +
        '<a href="#!" class="secondary-content">' +
        '<i class="material-icons" style="color:red;">delete</i>' +
        ' </a>'
        '</li>';
}

function handleCollectionItemClick(event){
    if(event){
        let currentTarget = event.currentTarget;
        if(currentTarget){
            if(currentTarget.classList){
                let element;
                let modalInstanceId;
                if(currentTarget.classList.contains('to-emails-modal-collection-item')){
                    element = document.getElementById("to-email");
                    modalInstanceId = '#to-emails-modal';
                }else if(currentTarget.classList.contains('from-emails-modal-collection-item')){
                    element = document.getElementById("from-email");
                    modalInstanceId = '#from-emails-modal';
                }

                if(element){
                    element.value = event.currentTarget.querySelector('.title').textContent;
                    element.focus();
                    $(modalInstanceId).modal('close');
                }
            }
        }
    }
}

function getToEmails(){
    return JSON.parse(localStorage.getItem("toEmails"));
}

function getFromEmails(){
    return JSON.parse(localStorage.getItem("fromEmails"));
}

function addClickEventListenersByClassName(className, clickHandler){
    let items = document.getElementsByClassName(className);
    if (items) {
        for (let itemIndex in items) {
            if (items.hasOwnProperty(itemIndex)) {
                let item = items[itemIndex];
                if (item.addEventListener) {
                    item.removeEventListener("click", clickHandler);
                    item.addEventListener("click", clickHandler);
                }
            }
        }
    }
}

$(document).ready(function () {
    let url = window.location.href;
    if (url && url.includes('?success')) {
        M.toast({
            html: 'Email Sent!',
            displayLength: 2000,
        })
    }

    if (document.getElementById('message-content-wrapper').innerHTML.indexOf('Unlicensed copy of the Froala Editor. Use it legally by purchasing a license.') != -1) {
        let editor = document.querySelector('#message-content-wrapper > div > div > div.fr-wrapper.show-placeholder > div:nth-child(1)');
        if (editor && editor.parentElement) {
            editor.parentElement.removeChild(editor);
        }
    }

    let element = document.getElementById("send-button");
    if (element) {
        element.removeEventListener("click", submit);
        element.addEventListener("click", submit);
    }

    let attachmentElement = document.getElementById('attachment');
    if (attachmentElement) {
        attachmentElement.addEventListener("change", (event) => {
            if (event) {
                let file = event.target.files[0];
                if (file) {
                    let reader = new FileReader();
                    reader.onload = handleAttachment;
                    reader.readAsText(file);
                }
            }
        });
    }

    updateToEmailAutoComplete(getToEmails());
    updateFromEmailAutoComplete(getFromEmails());

    $('#to-emails-modal').modal();
    $('#from-emails-modal').modal();

    buildModal('to-emails-modal-collection', getToEmails());
    buildModal('from-emails-modal-collection', getFromEmails());
});