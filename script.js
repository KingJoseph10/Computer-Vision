$(window).on("load", start);
$(document).on("change", "#url", change);
$(document).on("click", "#shortcut button", shortcut);

function start() {
    // APP LOADED
    $("#shortcut button:first").click();
};

function change() {
    // URL UPDATED
    $("#image").attr("src", $("#url").val());
}

function shortcut() {
    // SHORTCUT BUTTON CLICKED
    var href = $(this).attr("data-url");
    $("#url").val(href).change();
}

function loaded() {
    // IMAGE LOADED

    // PALETTE

    $("#palette").text("Loading ...");

    const colorThief = new ColorThief();
    const img = $("img")[0];

    const colors = colorThief.getPalette(img);
    const dominant = colorThief.getColor(img);

    console.log(colors, dominant);

    $("#palette").empty();
    // ADDING DOMINANT COLOUR
    $("#palette").append("<div class='p-4 rounded-circle d-inline-block border me-1' style='background-color:rgb(" + dominant[0] + ", " + dominant[1] + ", " + dominant[2] + ")'></div>");

    $.each(colors, addColor);

    function addColor(i, o) {
        // ITERATING PALETTE ITEMS
        $("#palette").append("<div class='p-3 rounded-circle d-inline-block border me-1' style='background-color:rgb(" + o[0] + ", " + o[1] + ", " + o[2] + ")'></div>");

    }

    // OCR

    $("#text").text("Loading ...");

    (async () => {
        const worker = await Tesseract.createWorker('eng');
        const { data: { text } } = await worker.recognize($("img")[0]);
        await worker.terminate();
        // WRITE THE RESULTS
        $("#text").text(text);
    })();


    // CLOUD VISION

    $("#vision").text("Loading ...");

    (async () => {

        const url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyB1hFvJjdgEmusE_l8y9sYshPAn3-4IS8M';
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "source": {
                                "imageUri": $("#image").attr("src")
                            }
                        },
                        "features": [
                            {
                                "maxResults": 50,
                                "type": "LANDMARK_DETECTION"
                            },
                            {
                                "maxResults": 50,
                                "type": "FACE_DETECTION"
                            },
                            {
                                "maxResults": 50,
                                "model": "builtin/latest",
                                "type": "OBJECT_LOCALIZATION"
                            },
                            {
                                "maxResults": 50,
                                "model": "builtin/latest",
                                "type": "LOGO_DETECTION"
                            },
                            {
                                "maxResults": 50,
                                "type": "LABEL_DETECTION"
                            },
                            {
                                "maxResults": 50,
                                "model": "builtin/latest",
                                "type": "DOCUMENT_TEXT_DETECTION"
                            },
                            {
                                "maxResults": 50,
                                "type": "SAFE_SEARCH_DETECTION"
                            },
                            {
                                "maxResults": 50,
                                "type": "IMAGE_PROPERTIES"
                            },
                            {
                                "maxResults": 50,
                                "type": "CROP_HINTS"
                            }
                        ]
                    }
                ]
            })
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            // WRITE THE RESULTS
            $("#vision").text(
                JSON.stringify(data, null, 2)
            );

        } catch (error) {
            console.error(error);
        }


    })();

}