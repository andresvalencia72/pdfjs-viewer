// Estado inicial de la aplicación

var defaultState = {
    pdf: null,
    currentPage: 1,
    zoom: 1,
    // TODO: rectangulos responsivos segun la escala
}

const pagesProps =  [

    {
        numberPage: 1,
        viewbox: {
            width:0,
            height:0
        },
        rectangleElements:[
        {
            coords: {cordX:0,cordY:0,width:180, height:40}
        },
        ],
    },
    {
        numberPage: 2,
        viewbox: {
            width:0,
            height:0
        },
        rectangleElements:[
        {
            coords: {cordX:0,cordY:0,width:180, height:40}
        },
        {
            coords: {cordX:150,cordY:300,width:380, height:40}
        },
        // {
        //     coords: {cordX:0,cordY:0,width:1800, height:20}
        // },
        ],
    },
]
    
    

// GET OUR PDF FILE
pdfjsLib.getDocument('24_Contrato_Indefinido.pdf').then((pdf) => {

    defaultState.pdf = pdf;

    render();

});


const renderRectangle = (rectangle, idElement)=>{
    const {coords} = rectangle;
    const {cordX,cordY, width, height} = coords

    // console.log({cordX, cordY, width, height})
    const rectElement = document.createElement('div');
    rectElement.setAttribute('id', `idElement-${idElement}`)
    rectElement.setAttribute('class', 'rectangle')
    rectElement.setAttribute('style',
     `
        bottom:${cordY* defaultState.zoom}px;
        lef:${cordX * defaultState.zoom}px;
        width: ${width* defaultState.zoom }px;
        height: ${height* defaultState.zoom}px;
        background: rgba(0,0,0,.4);
        position:absolute;
        z-index:1

    `);

    const canvasTag = document.querySelector('#canvas_wrapper');
    
    canvasTag.appendChild(rectElement);
}



const printRectangles = (numberOfPage) => {
    // TODO: resetear el canvas 
    const elements = pagesProps[numberOfPage]
    let rectangleElements = elements?.rectangleElements
    

    if (!rectangleElements) return

    rectangleElements.forEach((rectangle, idElement) => {
        console.log(idElement)
        renderRectangle(rectangle, idElement);
    });
}






// RENDER PDF DOCUMENT
function render() {
    defaultState.pdf.getPage(defaultState.currentPage).then((page) => {
        

        const canvasTag = document.querySelector('#canvas_wrapper');
    
        const rectangleTags = document.querySelectorAll('.rectangle')
        rectangleTags.forEach(rectangleTag => {
            canvasTag.removeChild(rectangleTag)
        });


        var canvas = document.getElementById("pdf_renderer");
        var ctx = canvas.getContext('2d');

        var viewport = page.getViewport(defaultState.zoom);
        // console.log(defaultState.zoom)
        // console.log({viewport})

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        defaultState.viewbox = {
            width: viewport.width,
            height: viewport.height,
        }

        // console.log({page})
        // console.log({viewbox:defaultState.viewbox})

        // defaultState.rectangleElements.forEach(rectangle => {
        //     console.log(rectangle)
        //     printRectangles(numberOfPage)
        // });
        console.log(page.pageIndex)
        printRectangles(page.pageIndex)

        page.render({
            canvasContext: ctx,
            viewport: viewport
        });
    });
}

// FUNCTION GO TO PREVIOUS SITE
document.getElementById('previous').addEventListener('click', (e) => {
    if (defaultState.pdf == null || defaultState.currentPage == 1)
        return;
    defaultState.currentPage -= 1;
    document.getElementById("current_page").value = defaultState.currentPage;
    //   document.body.innerHTML = ''
    render();
});

// FUNCTION GO TO PREVIOUS NEXT
document.getElementById('next').addEventListener('click', (e) => {
    if (defaultState.pdf == null || defaultState.currentPage > defaultState.pdf._pdfInfo.numPages)
        return;
    defaultState.currentPage += 1;
    document.getElementById("current_page").value = defaultState.currentPage;
    render();
});

// FUNCTION GO TO CUSTUM SITE
document.getElementById('current_page').addEventListener('keypress', (e) => {
    if (defaultState.pdf == null) return;

    var code = (e.keyCode ? e.keyCode : e.which);

    if (code == 13) { // ON CLICK ENTER GO TO SITE TYPED IN TEXT-BOX
        var desiredPage =
            document.getElementById('current_page').valueAsNumber;

        if (desiredPage >= 1 && desiredPage <= defaultState.pdf._pdfInfo.numPages) {
            defaultState.currentPage = desiredPage;
            document.getElementById("current_page").value = desiredPage;
            render();
        }
    }
});

// FUNCTION FOR ZOOM IN
document.getElementById('zoom_in').addEventListener('click', (e) => {
    if (defaultState.pdf == null) return;
    defaultState.zoom += 0.5;
    render();
});

// FUNCTION FOR ZOOM OUT
document.getElementById('zoom_out').addEventListener('click', (e) => {
    if (defaultState.pdf == null) return;
    defaultState.zoom -= 0.5;
    render();
});
