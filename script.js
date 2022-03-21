(() => {

    let app = {
        val: {
            width: 0,
            height: 0,
            pileRate: 0,
            square: 0,
            unit: 0
        },
        real:{
            width: 0,
            height: 0
        },
        def: {
            additionalInfo: new Object(),
            product: new Object(),
            formsPath: "***/forms/",
            optionalRollerBlind: false,
            pileRatesRequired: false,
            addToCartLock: true,
            colourModule: false,
            customizedColours: false,
            colourBarLength: false,
            colourBarWidth: false,
            symmetricalColouring: false,
            popup:{
                page: 0,
                pageLength: 0,
                categoryItems: new Array(),
                tulleRollerBlindApplicationTypeCategories: new Array(),
                doubleBreasted: false,
                beadOrTasselModel: false,
                beadOrTasselModelTwice: false,
                numberOfWing: 2,
                additionalProduct: new Object(),
                optionalRollerBlindRequired: false,
                calculateType: "",
                customizationFormFields: {
                    variables: new Array(),
                    paid: new Array(),
                    unpaid: new Array()
                },
                func: {
                    FICatalog: (id) => {
                        let temp = false;
                        for (const key in catalog) {
                            if(catalog[key].categoryId === id){
                                temp = catalog[key];
                            }
                        }
                        return temp;
                    }
                }
            }
        },
        func: {
            uuidv4: () => {
                return ([1e7]+1e3+4e3+8e3+1e11).replace(/[018]/g, c =>
                  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                );
            },
            numberFormat: (number, decimals, dec_point, thousands_sep) => {
                number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
                var n = !isFinite(+number) ? 0 : +number,
                    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                    s = '',
                    toFixedFix = function (n, prec) {
                        var k = Math.pow(10, prec);
                        return '' + Math.round(n * k) / k;
                    };
                s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
                if (s[0].length > 3) {
                    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
                }
                if ((s[1] || '').length < prec) {
                    s[1] = s[1] || '';
                    s[1] += new Array(prec - s[1].length + 1).join('0');
                }
                return s.join(dec);
            },
            asyncForEach: async (array, callback) => {
                for (const key in array) {
                    await callback(array[key], key, array);
                }
            },
            asyncForEach2: async (array, callback) => {
                for (let index = 0; index < Object.keys(array).length; index++) {
                    await callback(array[index], index, array);
                }
            },
            activated: () => {
                if(typeof app.def.additionalInfo["Perde Modülü"] !== "undefined"){
                    return true;
                }
                return false;
            },
            decimalComp: (ref) => {
                let temp = 0;
                for (let index = ref; index < 100000; index++) {
                    if(index % 10 === 0){
                        temp = index;
                        break;
                    }
                }
                return temp;
            },
            floatComp: (index) => {
                if(index.toString().indexOf(".") === -1){
                    return index;
                }
                let temp = index.toString().split(".")[1];
                temp = (temp.length === 1) ? temp + "0" : temp;
                temp = app.func.decimalComp(parseInt(temp.substring(0, 2)));
                if(temp === 100){
                    temp = parseInt(index.toString().split(".")[0]) + 1;
                }else{
                    temp = parseFloat(index.toString().split(".")[0] + "." + temp.toString());
                }
                return temp;
            },
            getProductPrice: () => {
                let target = $(".product-right .product-price-container");
                let pp = (target.hasClass("has-discount") === false) ? target.find(".product-price-old").text().trim() : target.find(".product-price-new").text().trim();
                pp = parseFloat(pp.replace(".", "").replace("," , ".").replace(" TL", ""));
                return pp;
            },
            seperation: (h, i) => {
                let min = 0, max = 0, comp = 0, ret = i, ret2 = false;
                let temp = h.split(",");
                for (let index = 0; index < temp.length; index++) {
                    min = parseInt(temp[index].split(":")[0].split("-")[0]);
                    max = parseInt(temp[index].split(":")[0].split("-")[1]);
                    comp = parseInt(temp[index].split(":")[1]);
                    if(min <= i && i <= max){
                        ret = comp;
                        ret2 = true;
                        break;
                    }
                }
                
                return {key: ret2, value: ret};
            },
            changePileRateToName: (val) => {
                let name = "";
                switch (val) {
                    case "1":
                        name = "Düz (Pilesiz) Dikim";
                        break;
                    case "2.05":
                        name = "Seyrek Pile";
                        break;
                    case "2.55":
                        name = "Normal Pile";
                        break;
                    case "2.9":
                        name = "Orta Sık Pile";
                        break;
                    case "3.05":
                        name = "Sık Pile";
                        break;
                    default:
                        name = "Özel Pile";
                        break;
                }
                return name;
            },
            getform: (url, data) => {
                return $.ajax({
                    url: url,
                    type: "POST",
                    data: data
                });
            },
            seperateHeight: (list, val) => {
                let temp = list.split(",");
                let temp2 = val;
                for (let index = 0; index < temp.length; index++) {
                    temp[index] = temp[index].split(":");
                }
                for (let index = 0; index < temp.length; index++) {
                    temp[index][0] = temp[index][0].split("-");
                }
                for (let index = 0; index < temp.length; index++) {
                    if(val >= parseFloat(temp[index][0][0].trim()) && val < parseFloat(temp[index][0][1].trim())){
                        temp2 = temp[index][1];
                        break;
                    }
                }
                return app.func.decimalComp(temp2);
            },
            calculate: () => {
                const minSquare = (typeof app.def.additionalInfo["Minimum Ebat"] !== "undefined") ? parseFloat(app.def.additionalInfo["Minimum Ebat"]) : 1;
                const calculateType = (typeof app.def.additionalInfo["Hesaplama Yöntemi"] !== "undefined") ? app.def.additionalInfo["Hesaplama Yöntemi"] : false;
                if(isNaN(app.val.width) || isNaN(app.val.height)){
                    return false;
                }
                app.def.popup.calculateType = calculateType;
                switch (calculateType) {
                    case "Tül Perde":
                        const kp = (typeof app.def.additionalInfo["Katlama Payı"] !== "undefined") ? app.def.additionalInfo["Katlama Payı"].split(",") : false;    
                        let bp = (typeof app.def.additionalInfo["Bindirme Payı"] !== "undefined") ? app.def.additionalInfo["Bindirme Payı"].split(",") : false;
                        
                        for (let index = 0; index < bp.length; index++) {
                            bp[index] = bp[index].split("/");
                        }

                        for (let index = 0; index < bp.length; index++) {
                            bp[index][0] = bp[index][0].split("-");
                        }
                        
                        for (let index = 0; index < bp.length; index++) {
                            if(app.val.width >= parseFloat(bp[index][0][0].trim()) && app.val.width < parseFloat(bp[index][0][1].trim())){
                                bp = parseFloat(bp[index][1].trim()) * 0.01;
                                break;
                            }
                        }

                        if(typeof bp === "object"){
                            for (let index = 0; index < bp.length; index++) {
                                if(app.val.width < parseFloat(bp[index][0][0].trim())){
                                    bp = parseFloat(bp[0][1].trim()) * 0.01;
                                    break;
                                }
                            }
                            for (let index = 0; index < bp.length; index++) {
                                if(app.val.width > parseFloat(bp[index][0][0].trim())){
                                    bp = parseFloat(bp[bp.length - 1][1].trim()) * 0.01;
                                    break;
                                }
                            }
                        }

                        if(bp === false || kp === false || isNaN(app.val.pileRate) || app.val.pileRate === 0){
                            app.val.square = 0; app.val.unit = 0;
                            $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                            $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                            return false;
                        }

                        let target = $("#mainForm #doubleBreastedOrPleatedPlanting .btn-primary");
                        if(target.attr("data-selector") === "doubleBreastedPlanting" && app.def.popup.beadOrTasselModel === false && app.def.popup.numberOfWing === 1){
                            app.val.square = app.func.floatComp(((app.val.width * 0.01) * app.val.pileRate) + parseFloat(kp[0].trim()));
                            app.val.square = (app.val.square < minSquare) ? minSquare : app.val.square;
                            app.val.unit = (app.val.square * (app.func.getProductPrice() + thisProduct.constVariables["16"])) + thisProduct.constVariables["19"];
                            if(!isNaN(app.val.square) && !isNaN(app.val.unit)){
                                $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                                $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                            }
                        }else if(target.attr("data-selector") === "doubleBreastedPlanting" && app.def.popup.beadOrTasselModel === false && app.def.popup.numberOfWing === 2){
                            app.val.square = app.func.floatComp(((app.val.width * 0.01 + bp) * app.val.pileRate) + parseFloat(kp[1].trim()));
                            app.val.square = (app.val.square < minSquare) ? minSquare : app.val.square;
                            app.val.unit = (app.val.square * (app.func.getProductPrice() + thisProduct.constVariables["16"])) + thisProduct.constVariables["18"];
                            if(!isNaN(app.val.square) && !isNaN(app.val.unit)){
                                $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                                $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                            }
                        }else if(target.attr("data-selector") === "doubleBreastedPlanting" && app.def.popup.beadOrTasselModel !== false && app.def.popup.numberOfWing === 1){
                            app.val.square = app.func.floatComp(((app.val.width * 0.01) * app.val.pileRate) + parseFloat(kp[0].trim()));
                            app.val.square = (app.val.square < minSquare) ? minSquare : app.val.square;
                            app.val.unit = (app.val.square * (app.func.getProductPrice() + thisProduct.constVariables["17"])) + thisProduct.constVariables["19"];
                            if(!isNaN(app.val.square) && !isNaN(app.val.unit)){
                                $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                                $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                            }
                        }else if(target.attr("data-selector") === "doubleBreastedPlanting" && app.def.popup.beadOrTasselModel !== false && app.def.popup.numberOfWing === 2){
                            app.val.square = app.func.floatComp((((app.val.width * 0.01) + bp) * app.val.pileRate) + parseFloat(kp[1].trim()));
                            app.val.square = (app.val.square < minSquare) ? minSquare : app.val.square;
                            app.val.unit = (app.val.square * (app.func.getProductPrice() + thisProduct.constVariables["17"])) + thisProduct.constVariables["18"];
                            if(!isNaN(app.val.square) && !isNaN(app.val.unit)){
                                $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                                $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                            }
                        }else if(target.attr("data-selector") === "pleatedPlanting"){
                            app.val.square = app.func.floatComp(((app.val.width * 0.01) * app.val.pileRate) + parseFloat(kp[0].trim()));
                            app.val.square = (app.val.square < minSquare) ? minSquare : app.val.square;
                            app.val.unit = (app.val.square * (app.func.getProductPrice() + thisProduct.constVariables["20"])) + thisProduct.constVariables["21"];
                            if(!isNaN(app.val.square) && !isNaN(app.val.unit)){
                                $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                                $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                            }
                        }
                        
                    break;
                    case "Briz Tül Perde":
                        const kp4 = (typeof app.def.additionalInfo["Katlama Payı"] !== "undefined") ? parseFloat(app.def.additionalInfo["Katlama Payı"]) : false;
                        if(isNaN(app.val.pileRate) || app.val.pileRate === 0 || kp4 === false){
                            app.val.square = 0; app.val.unit = 0;
                            $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                            $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                            return false;
                        }
                        app.val.square = app.func.floatComp(((app.val.width * 0.01) * app.val.pileRate) + kp4);
                        app.val.square = (app.val.square < minSquare) ? minSquare : app.val.square;
                        app.val.unit = app.val.square * app.func.getProductPrice();
                        if(!isNaN(app.val.square) && !isNaN(app.val.unit)){
                            $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                            $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                        }
                    break;
                    case "Pileli Fon Perde":
                        const kp3 = (typeof app.def.additionalInfo["Katlama Payı"] !== "undefined") ? parseFloat(app.def.additionalInfo["Katlama Payı"]) : false;
                        if(isNaN(app.val.pileRate) || app.val.pileRate === 0 || kp3 === false){
                            app.val.square = 0; app.val.unit = 0;
                            $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                            $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                            return false;
                        }
                        app.val.square = app.func.floatComp(((app.val.width * 0.01) * app.val.pileRate) + kp3);
                        app.val.square = (app.val.square < minSquare) ? minSquare : app.val.square;
                        app.val.unit = (app.def.popup.numberOfWing !== 1) ? (app.val.square * app.func.getProductPrice()) * 2 : (app.val.square * app.func.getProductPrice());
                        if(!isNaN(app.val.square) && !isNaN(app.val.unit)){
                            $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                            $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                        }
                    break;
                    case "Büzgü Fon Perde":
                        const kp2 = (typeof app.def.additionalInfo["Katlama Payı"] !== "undefined") ? parseFloat(app.def.additionalInfo["Katlama Payı"]) : false;
                        if(kp2 === false){
                            app.val.square = 0; app.val.unit = 0;
                            $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                            $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                            return false;
                        }
                        app.val.square = app.func.floatComp((app.val.height * 0.01) + kp2);
                        app.val.square = (app.val.square < minSquare) ? minSquare : app.val.square;
                        app.val.unit = (app.def.popup.numberOfWing !== 1) ? (app.val.square * app.func.getProductPrice()) * 2 : (app.val.square * app.func.getProductPrice());
                        if(!isNaN(app.val.square) && !isNaN(app.val.unit)){
                            $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                            $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                        }
                    break;
                    case "Lazer Kesim Stor":
                        app.val.square = app.func.floatComp((app.val.width * 0.01) * (app.val.height * 0.01));
                        app.val.square = (app.val.square < minSquare) ? minSquare : app.val.square;
                        app.val.unit = (app.val.width * 0.01) * app.func.getProductPrice();
                        if(!isNaN(app.val.square) && !isNaN(app.val.unit)){
                            $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat((app.val.width * 0.01), 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                            $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                        }
                    break;
                    case "Plicell Perde": 
                        app.val.square = (app.val.width * 0.01) * (app.val.height * 0.01);
                        app.val.square = (app.val.square < minSquare) ? minSquare : app.val.square;
                        app.val.unit = app.val.square * app.func.getProductPrice();
                        if(!isNaN(app.val.square) && !isNaN(app.val.unit)){
                            $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                            $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                        }
                    break;
                    default:
                        app.val.square = app.func.floatComp((app.val.width * 0.01) * (app.val.height * 0.01));
                        if($("#mainForm #pileRates .btn-primary").length > 0){
                            app.val.square = app.func.floatComp(app.val.square * app.val.pileRate);
                        }
                        app.val.square = (app.val.square < minSquare) ? minSquare : app.val.square;
                        app.val.unit = app.val.square * app.func.getProductPrice();
                        if(!isNaN(app.val.square) && !isNaN(app.val.unit)){
                            $("#mainForm #display [data-selector='square'], #extensionPopup .popup #display [data-selector='display-square']").text(`${ app.func.numberFormat(app.val.square, 2, ",", ".") } ${ thisProduct.stockTypeLabel }`);
                            $("#mainForm #display [data-selector='total-amount'], #extensionPopup .popup #display [data-selector='display-unit']").text(`${ app.func.numberFormat(app.val.unit, 2, ",", ".") } ${ thisProduct.currency }`);
                        }
                    break;
                }

                let mainProductQuantity = parseFloat((app.val.unit / app.func.getProductPrice()).toFixed(2));
                app.def.product.mainProductQuantity = mainProductQuantity;
                app.def.product.mainProductId = thisProduct.id;
            }
        }
    }

    let doubleBreastedOrPleatedPlanting, colourModule, optionalRollerBlind, optionalRollerBlindName, optionalRollerBlindRequired;

    let loadMainForm = async () => {

        $(".product-right .product-qty-wrapper").addClass("d-none");

        doubleBreastedOrPleatedPlanting = (typeof app.def.additionalInfo["Dikim Modeli"] !== "undefined") ? app.def.additionalInfo["Dikim Modeli"] : false;
        colourModule = (typeof app.def.additionalInfo["Renk"] !== "undefined") ? app.def.additionalInfo["Renk"].replace(/\s/g, "").split("#") : false;
        optionalRollerBlind = (typeof app.def.additionalInfo["Opsiyonel Stor Perde"] !== "undefined") ? (app.def.additionalInfo["Opsiyonel Stor Perde"].indexOf("/") !== -1) ? parseInt(app.def.additionalInfo["Opsiyonel Stor Perde"].split("/")[0]) : parseInt(app.def.additionalInfo["Opsiyonel Stor Perde"]) : false;
        optionalRollerBlindName = app.def.popup.func.FICatalog(optionalRollerBlind)["categoryName"];
        optionalRollerBlindRequired = (typeof app.def.additionalInfo["Opsiyonel Stor Perde"] !== "undefined") ? (app.def.additionalInfo["Opsiyonel Stor Perde"].indexOf("-") !== -1) ? true : false : false;
        const form = await app.func.getform(app.def.formsPath+"form.php", {thisProduct: JSON.stringify(thisProduct), doubleBreastedOrPleatedPlanting: doubleBreastedOrPleatedPlanting, optionalRollerBlind: optionalRollerBlind, optionalRollerBlindName: optionalRollerBlindName, optionalRollerBlindRequired: optionalRollerBlindRequired, colourModule: colourModule});
        $(".product-right .product-cart-buttons").before($(form));

        if(doubleBreastedOrPleatedPlanting === 1){
            app.def.popup.doubleBreasted = true;
        }

        if(optionalRollerBlindRequired !== false){
            app.def.optionalRollerBlind = (typeof app.def.additionalInfo["Opsiyonel Stor Perde"] !== "undefined") ? (app.def.additionalInfo["Opsiyonel Stor Perde"].indexOf("/") !== -1) ? parseInt(app.def.additionalInfo["Opsiyonel Stor Perde"].split("/")[0]) : parseInt(app.def.additionalInfo["Opsiyonel Stor Perde"]) : false;
            app.def.popup.optionalRollerBlindRequired = true;
        }

        if(colourModule !== false){
            app.def.colourModule = true;
        }

        setTimeout(() => {
            let target = $("#mainForm #doubleBreastedOrPleatedPlanting [data-selector='doubleBreastedPlanting']");
            if(target.length > 0){
                target.trigger("click");
                $("#mainForm #pileRates .pile-rate:eq(0) a").addClass("disabled");
            }else{
                target = $("#mainForm #doubleBreastedOrPleatedPlanting [data-selector='pleatedPlanting']");
                if(target.length > 0 && target.attr("data-activated") === "1"){
                    target.trigger("click");
                    if($("#mainForm #pileRates .pile-rate:eq(0) a").hasClass("disabled") !== false){
                        $("#mainForm #pileRates .pile-rate:eq(0) a").removeClass("disabled");
                    }
                    $("#mainForm #pileRates .pile-rate:eq(0) a").trigger("click");
                }
            }
        }, 500);

    }

    let loadMainPopup = async () => {

        let errorLog = new Array();

        if(isNaN(app.val.width) || app.val.width === 0){
            errorLog.push("width");
        }

        if(isNaN(app.val.height) || app.val.height === 0){
            errorLog.push("height");
        }

        if(app.def.pileRatesRequired === true && (isNaN(app.val.pileRate) || app.val.pileRate === 0)){
            errorLog.push("pileRate");
        }
        
        if(errorLog.length > 0){
            Swal.fire({
                icon: 'warning',
                title: 'Zorunlu Alan!',
                text: "Lütfen bir seçim yapınız.",
                confirmButtonText: 'Tamam',
                didOpen: () => {
                    errorLog.forEach(element => {
                        if(element === "width"){
                            $("#mainForm #width").addClass("validate-error");
                        }else if(element === "height"){
                            $("#mainForm #height").addClass("validate-error");
                        }else if(element === "pileRate"){
                            $("#mainForm #pileRates").parent().addClass("validate-error");
                        }
                    });
                }
            });
            return false;
        }

        const wingDirectionChoice = (typeof app.def.additionalInfo["Kanat Tercihi"] !== "undefined") ? app.def.additionalInfo["Kanat Tercihi"] : false;

        if(typeof app.def.additionalInfo["Kategori Sepete Ekle"] !== "undefined"){

            let temp = app.def.additionalInfo["Kategori Sepete Ekle"].split(",");

            for (let index = 0; index < temp.length; index++) {
                app.def.popup.categoryItems[index] = new Object();
                app.def.popup.categoryItems[index].catalog = app.def.popup.func.FICatalog(parseFloat(temp[index].split("/")[0].trim()));
                app.def.popup.categoryItems[index].type = temp[index].split("/")[1].trim();
            }

        }else{

            if(wingDirectionChoice === false && app.def.popup.doubleBreasted === false && app.def.optionalRollerBlind === false){

                let customization = $(".product-customization-group[data-group-id='1'] textarea");

                app.def.popup.customizationFormFields.variables = new Array();
                app.def.popup.customizationFormFields.paid = new Array();
                app.def.popup.customizationFormFields.unpaid = new Array();
                customization.val(null).trigger("change");
    
                app.def.popup.customizationFormFields.variables.push(
                    { key: "En", value: app.real.width + "cm" }, { key: "Boy", value: app.real.height + "cm" }, { key: "Ebat", value: app.val.square + thisProduct.stockTypeLabel }
                );
    
                if(!isNaN(app.val.pileRate) && app.val.pileRate !== 0){
                    app.def.popup.customizationFormFields.variables.push({key: "Pile", value: app.val.pileRate});
                }
                
                await app.func.asyncForEach(app.def.popup.customizationFormFields, (elem) => {
                    elem.forEach(element => {
                        customization.val(customization.val() + "- " + element.value + "(" + element.key + ")\n").trigger("change");
                    });
                });
    
                app.def.addToCartLock = false;
                $(".product-qty-wrapper .product-qty>div input").val(app.def.product.mainProductQuantity).trigger("change");
                $(".product-right [data-selector='add-to-cart'].add-to-cart-button").attr("data-quantity", app.def.product.mainProductQuantity).trigger("click");
                setTimeout(() => { $("#header [data-selector='cart-item-count']").parent().trigger("click"); }, 1500);  
                
                return false;

            }
        }

        $("body").addClass("overflow-hidden");

        if(typeof app.def.additionalInfo["Tül - Stor Uygulama Şekli Kategorileri"] !== "undefined"){
            app.def.popup.tulleRollerBlindApplicationTypeCategories = app.def.additionalInfo["Tül - Stor Uygulama Şekli Kategorileri"].split(",");
        }

        for (let index = 0; index < app.def.popup.tulleRollerBlindApplicationTypeCategories.length; index++) {
            app.def.popup.tulleRollerBlindApplicationTypeCategories[index] = parseFloat(app.def.popup.tulleRollerBlindApplicationTypeCategories[index].trim());
        }

        const popup = await app.func.getform(app.def.formsPath+"popup.php", {thisProduct: JSON.stringify(thisProduct), app: JSON.stringify(app), wingDirectionChoice: wingDirectionChoice});
        $("#mainForm").after($(popup));

        app.def.popup.pageLength = $("#extensionPopup .popup .body [data-wrapper='additional-info']").length
        
        if(typeof $("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(0)").attr("data-category-name") !== "undefined"){
            let categoryName = $("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(0)").attr("data-category-name");
            $("#extensionPopup .popup #header h4").text(categoryName);
        }
        
    }

    $(document).ready(() => {

        let key = "", value = "";

        $(".product-right .product-list-container .product-list-row").each((index, elem) => {
            key = $(elem).find(".product-list-title").text().trim();
            value = $(elem).find(".product-list-content").text().trim();
            app.def.additionalInfo[key] = value;
        });

        console.log(app.def.additionalInfo);

        if(app.func.activated() !== false){
            loadMainForm().then(() => {
                const config = new Object();
                config.seperateHeight = (typeof app.def.additionalInfo["Ektra Minimum Boy Tanımlaması"] !== "undefined") ? app.def.additionalInfo["Ektra Minimum Boy Tanımlaması"] : false;
                config.increase = (typeof app.def.additionalInfo["Artış Miktarı"] !== "undefined") ? parseFloat(app.def.additionalInfo["Artış Miktarı"]) : false;
                config.maxWidth = (typeof app.def.additionalInfo["Maksimum En"] !== "undefined") ? parseFloat(app.def.additionalInfo["Maksimum En"]) : false;
                config.maxHeight = (typeof app.def.additionalInfo["Maksimum Boy"] !== "undefined") ? parseFloat(app.def.additionalInfo["Maksimum Boy"]) : false;
                config.pileRates = (typeof app.def.additionalInfo["Pile Oranları"] !== "undefined") ? (app.def.additionalInfo["Pile Oranları"].indexOf("/") !== -1) ? app.def.additionalInfo["Pile Oranları"].split("/")[0].split(",") : app.def.additionalInfo["Pile Oranları"].split(",") : false;

                app.def.pileRatesRequired = (typeof app.def.additionalInfo["Pile Oranları"] !== "undefined") ? (app.def.additionalInfo["Pile Oranları"].indexOf("/") !== -1) ? true : false : false;

                if(typeof app.def.additionalInfo["Mininum En"] !== "undefined"){
                    if(app.def.additionalInfo["Mininum En"].indexOf("/") !== -1){
                        config.minWidth = parseFloat(app.def.additionalInfo["Mininum En"].split("/")[0].trim());
                        config.specialMinWidth = parseFloat(app.def.additionalInfo["Mininum En"].split("/")[1].trim());
                    }else{
                        config.minWidth = parseFloat(app.def.additionalInfo["Mininum En"]);
                        config.specialMinWidth = false;
                    }
                }

                if(typeof app.def.additionalInfo["Minimum Boy"] !== "undefined"){
                    if(app.def.additionalInfo["Minimum Boy"].indexOf("/") !== -1){
                        config.minHeight = parseFloat(app.def.additionalInfo["Minimum Boy"].split("/")[0].trim());
                        config.specialMinHeight = parseFloat(app.def.additionalInfo["Minimum Boy"].split("/")[1].trim());
                    }else{
                        config.minHeight = parseFloat(app.def.additionalInfo["Minimum Boy"]);
                        config.specialMinHeight = false;
                    }
                }

                if(config.minWidth === false || config.minHeight === false || config.maxWidth === false || config.maxHeight === false){
                    return false;
                }

                let tempWidthIndex = 0;
                for (let index = config.minWidth; index <= config.maxWidth; index = index + config.increase) {
                    tempWidthIndex = (config.specialMinWidth !== false) ? (index < config.specialMinWidth) ? config.specialMinWidth : (index%10 !== 0) ? app.func.decimalComp(Math.round(index)) : index : app.func.decimalComp(Math.round(index));
                    $("#mainForm #width").append(`<option value="${ tempWidthIndex }">${ index } cm</option>`);
                }

                let tempHeightIndex = 0;
                for (let index = config.minHeight; index <= config.maxHeight; index = index + config.increase) {
                    tempHeightIndex = (config.specialMinHeight !== false && config.seperateHeight === false) ? (index < config.specialMinHeight) ? config.specialMinHeight : (index%10 !== 0) ? app.func.decimalComp(Math.round(index)) : app.func.decimalComp(Math.round(index)) : (config.seperateHeight !== false) ? app.func.seperateHeight(config.seperateHeight, index) : app.func.decimalComp(Math.round(index));
                    $("#mainForm #height").append(`<option value="${ tempHeightIndex }">${ index } cm</option>`);
                }

                if(config.pileRates === false){
                    return false;
                }

                $("#mainForm #display").before(`<div class="container mb-5 border pb-3 px-3">
                    <div class="row m-0 mt-3">
                        <h4 class="mb-4">Pile Seçimi</h4>
                    </div>
                    <div class="row" id="pileRates"></div>
                </div>`);
                
                for (let index = 0; index < config.pileRates.length; index++) {
                    $("#mainForm #pileRates").append(`<div class="col-sm-6 col-md-4 pile-rate py-3">
                        <a href="javascript:void(0);" class="btn btn-secondary btn-sm w-100 font-weight-bold border d-flex justify-content-center align-items-center position-relative" data-value='${ config.pileRates[index].trim() }' data-activated="1">
                            ${ app.func.changePileRateToName(config.pileRates[index].trim()) }
                        </a>
                    </div>`);
                }

            });
        }

        if(window.location.href.indexOf("/sepet") !== -1){
            let cloneBtn = $("#cart-content .cart-buttons [data-selector='return-back']").clone();
            cloneBtn.removeAttr("data-selector").attr("id", "clearAllCartItems").removeClass("btn-secondary").addClass("btn-success font-weight-bold").html(`
                <i class="fas fa-trash"></i>
            <span>SEPETİ TEMİZLE</span>`);
            $("#cart-content .cart-buttons").addClass("d-flex justify-content-between align-items-center").append($(cloneBtn));

            for (const iterator of $("#cart-items").find(".cart-item")) {
                $(iterator).find("[data-selector='qty-wrapper']").addClass("d-none");
                if($(iterator).find(".collapse-wrapper").length !== 0){
                    let temp = $(iterator).find(".collapse-wrapper").text().split("-");
                    let html = `<div class="container p-0 mt-3"><div class="row m-0 mb-3">Seçimler :</div><div class="row m-0" id="collapseWrapper"><ul class="list-group w-100">`;
                    for (let index = 0; index < temp.length; index++) {
                        if(temp[index].split("\n")[0].trim() !== "" && temp[index].split("\n")[0].trim() !== "Seçimler :"){
                            if(temp[index].split("\n")[0].trim().indexOf("uniqId:") < 0){
                                html += `<li class="list-group-item">${ temp[index].split("\n")[0].trim() }</li>`;
                            }
                        }
                    }
                    html += `</ul></div></div>`;
                    $(iterator).find(".collapse-wrapper").addClass("d-none").after(html);
                    $(iterator).find("[data-selector='qty-wrapper']").after(`<div class="container">
                        <input type="text" class="form-control text-center border disabled" value="1 Adet">
                    </div>`);
                }else{
                    $(iterator).find("[data-selector='qty-wrapper']").after(`<div class="container">
                        <input type="text" class="form-control text-center border disabled" value="Ek Ürün">
                    </div>`);
                }
                $(iterator).find("[data-selector='delete-cart-item']").addClass("disabled d-none");
            }

            $(document).on("click", "#cart-content .cart-buttons #clearAllCartItems", (e) => {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sepetiniz Temizlenecek!',
                    text: "Sepetinizdeki tüm ürünler silinecektir.",
                    showCancelButton: true,
                    cancelButtonText: "Vazgeç",
                    confirmButtonText: 'Onayla',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            customClass: {
                                confirmButton: 'btn btn-success btn-loading disabled border-0',
                            },
                            icon: 'warning',
                            title: 'Sepetiniz Temizleniyor!',
                            text: "Sepetinizdeki tüm ürünler siliniyor.",
                            confirmButtonText: '',
                            allowOutsideClick: false
                        })
                        IdeaCart.flush();
                        setTimeout(() => { window.location.reload(); }, 1500);
                    }
                });
            });
        }
        
    });

    $(document).on("DOMNodeRemoved", ".loading-bar", () => {

        if(window.location.href.indexOf("/sepet") !== -1){

            for (const iterator of $("#cart-items").find(".cart-item")) {
                $(iterator).find("[data-selector='qty-wrapper']").addClass("d-none");
                if($(iterator).find(".collapse-wrapper").length !== 0){
                    let temp = $(iterator).find(".collapse-wrapper").text().split("-");
                    let html = `<div class="container p-0 mt-3"><div class="row m-0 mb-3">Seçimler :</div><div class="row m-0" id="collapseWrapper"><ul class="list-group w-100">`;
                    for (let index = 0; index < temp.length; index++) {
                        if(temp[index].split("\n")[0].trim() !== "" && temp[index].split("\n")[0].trim() !== "Seçimler :"){
                            html += `<li class="list-group-item">${ temp[index].split("\n")[0].trim() }</li>`;
                        }
                    }
                    html += `</ul></div></div>`;
                    $(iterator).find(".collapse-wrapper").addClass("d-none").after(html);
                    $(iterator).find("[data-selector='qty-wrapper']").after(`<div class="container">
                        <input type="text" class="form-control text-center border disabled" value="1 Adet">
                    </div>`);
                }else{
                    $(iterator).find("[data-selector='qty-wrapper']").after(`<div class="container">
                        <input type="text" class="form-control text-center border disabled" value="Ek Ürün">
                    </div>`);
                }
            }

        }

    });

    $(window).on("resize", () => {
        $("#mainForm #colourModule [data-wrapper='colourChoiceBars']").html("");
        if(app.val.width === 0 || isNaN(app.val.width)){
            $("#mainForm #colourModule [data-wrapper='colourChoiceBars']").append(`<div class="alert alert-dark w-100 text-center font-weight-bold" role="alert">
                En Seçimi Yapınız.
            </div>`);
            return false;
        }
        for (let index = 0; index < app.def.colourBarLength; index++) {
            $("#mainForm #colourModule [data-wrapper='colourChoiceBars']").append(`<span class="bar-item d-flex justify-content-center align-items-end border mr-1 mb-1" data-index="${ index }" style="width:calc(${ app.def.colourBarWidth }px/${ app.def.colourBarLength });">
                ${ index + 1 }
            </span>`);
        }
    });

    $(document).on("change", "#width", (e) => {
        $(e.currentTarget).removeClass("validate-error");
        app.real.width = parseFloat($(e.currentTarget).find("option:selected").text().trim().replace("cm", ""));
        app.real.height = parseFloat($("#mainForm #height option:selected").text().trim().replace("cm", ""));
        app.val.width = parseFloat($(e.currentTarget).find("option:selected").val());
        app.val.height = parseFloat($("#mainForm #height option:selected").val());
        if($("#pileRates").length > 0){
            app.val.pileRate = parseFloat($("#mainForm #pileRates .btn-primary").attr("data-value"));
        }
        if(app.def.colourModule !== false){
            app.def.colourBarLength = Math.round(app.val.width / 10.5);
            app.def.colourBarWidth = $("#mainForm #colourModule [data-wrapper='colourChoiceBars']").width();
            $("#mainForm #colourModule [data-wrapper='colourChoiceBars']").html("");
            for (let index = 0; index < app.def.colourBarLength; index++) {
                $("#mainForm #colourModule [data-wrapper='colourChoiceBars']").append(`
                    <span class="bar-item d-flex justify-content-center align-items-end border mr-1 mb-1" data-index="${ index }" style="width:calc(${ app.def.colourBarWidth }px/${ app.def.colourBarLength });}">
                        ${ index + 1 }
                    </span>
                `);
            }
        }
        app.func.calculate();
    });

    $(document).on("change", "#height", (e) => {
        $(e.currentTarget).removeClass("validate-error");
        app.val.height = parseFloat($(e.currentTarget).find("option:selected").val());
        app.val.width = parseFloat($("#mainForm #width option:selected").val());
        app.real.height = parseFloat($(e.currentTarget).find("option:selected").text().trim().replace("cm", ""));
        app.real.width = parseFloat($("#mainForm #width option:selected").text().trim().replace("cm", ""));
        if($("#pileRates").length > 0){
            app.val.pileRate = parseFloat($("#mainForm #pileRates .btn-primary").attr("data-value"));
        }
        app.func.calculate();
    });

    $(document).on("click", "#pileRates a", (e) => {
        $(e.currentTarget).parents("#pileRates").parent().removeClass("validate-error");
        if($(e.currentTarget).hasClass("disabled") !== false){
            return false;
        }
        if($(e.currentTarget).hasClass("btn-primary") === false){
            $(e.currentTarget).parents("#pileRates").find(".btn-primary").removeClass("btn-primary").addClass("btn-secondary");
            $(e.currentTarget).removeClass("btn-secondary").addClass("btn-primary");
            app.val.pileRate = parseFloat($(e.currentTarget).attr("data-value"));
        }else{
            $(e.currentTarget).removeClass("btn-primary").addClass("btn-secondary");
            app.val.pileRate = 0;
        }
        app.val.width = parseFloat($("#mainForm #width option:selected").val());
        app.val.height = parseFloat($("#mainForm #height option:selected").val());
        app.func.calculate();
    });

    $(document).on("click", "#mainForm #doubleBreastedOrPleatedPlanting a", (e) => {
        
        $(e.currentTarget).parents("#doubleBreastedOrPleatedPlanting").find("a.btn-primary").removeClass("btn-primary").addClass("btn-secondary");
        $(e.currentTarget).removeClass("btn-secondary").addClass("btn-primary");

        if($(e.currentTarget).attr("data-selector") === "doubleBreastedPlanting"){
            app.def.popup.doubleBreasted = true;
            if($("#mainForm #pileRates").length > 0){
                $("#mainForm #pileRates .pile-rate:eq(0) a").addClass("disabled");
                if($("#mainForm #pileRates .pile-rate a.btn-primary").length === 0){
                    $("#mainForm #pileRates .pile-rate a.btn-primary").trigger("click");
                }
                for (const iterator of $("#mainForm #pileRates .pile-rate")) {
                    if($(iterator).find("a").hasClass("disabled") === false){
                        $(iterator).find("a").trigger("click");
                        break;
                    }
                }
            }
        }else if($(e.currentTarget).attr("data-selector") === "pleatedPlanting"){
            app.def.popup.doubleBreasted = false;
            if($("#mainForm #pileRates").length > 0){
                $("#mainForm #pileRates .pile-rate:eq(0) a").removeClass("disabled").trigger("click");
            }
        }
        app.func.calculate();
    });

    $(document).on("click", "#mainForm [data-wrapper='optional-roller-blind'] a", (e) => {

        if(app.def.popup.optionalRollerBlindRequired !== false){
            Swal.fire({
                icon: 'warning',
                title: 'Zorunlu Alan!',
                text: "Bu alan gereklidir.",
                confirmButtonText: 'Tamam',
            });
            return false;
        }

        if($(e.currentTarget).hasClass("btn-secondary") !== false){
            app.def.optionalRollerBlind = (typeof app.def.additionalInfo["Opsiyonel Stor Perde"] !== "undefined") ? (app.def.additionalInfo["Opsiyonel Stor Perde"].indexOf("/") !== -1) ? parseInt(app.def.additionalInfo["Opsiyonel Stor Perde"].split("/")[0]) : parseInt(app.def.additionalInfo["Opsiyonel Stor Perde"]) : false;
            $(e.currentTarget).removeClass("btn-secondary").addClass("btn-primary");
        }else{
            app.def.optionalRollerBlind = false;
            $(e.currentTarget).removeClass("btn-primary").addClass("btn-secondary");
        }
        
    });

    $(document).on("click", "#mainForm #colourModule [data-wrapper='colourPalette'] .colour", (e) => {
        $(e.currentTarget).parents("[data-wrapper='colourPalette']").find(".fa-check").remove();
        $(e.currentTarget).append(`<i class="fas fa-check"></i>`);
    });

    $(document).on("click", "#mainForm #colourModule [data-wrapper='colourChoiceBars'] .bar-item", (e) => {

        if($(e.currentTarget).parents("#colourModule").find("[data-wrapper='colourPalette'] .fa-check").length === 0){
            Swal.fire({
                icon: 'warning',
                title: 'Zorunlu Alan!',
                text: "Lütfen bir renk seçimi yapınız.",
                confirmButtonText: 'Tamam',
            });
            return false;
        }

        let colourInfo = new Object();
        colourInfo.colour = $(e.currentTarget).parents("#colourModule").find("[data-wrapper='colourPalette'] .fa-check").parent().attr("data-colour");
        colourInfo.code = $(e.currentTarget).parents("#colourModule").find("[data-wrapper='colourPalette'] .fa-check").parent().attr("data-colour-code");

        if(app.def.symmetricalColouring === false){
            $(e.currentTarget).attr("data-colour", colourInfo.colour).attr("data-colour-code", colourInfo.code).attr("style", "width:calc(" + app.def.colourBarWidth + "px/" + app.def.colourBarLength + "); background: " + colourInfo.colour + ";");
        }else{
            let symmetricalTarget = ($(e.currentTarget).parent().find(".bar-item").length - 1) - parseFloat($(e.currentTarget).attr("data-index"));
            $(e.currentTarget).attr("data-colour", colourInfo.colour).attr("data-colour-code", colourInfo.code).attr("style", "width:calc(" + app.def.colourBarWidth + "px/" + app.def.colourBarLength + "); background: " + colourInfo.colour + ";");
            $(e.currentTarget).parent().find(".bar-item:eq(" + symmetricalTarget + ")").attr("data-colour", colourInfo.colour).attr("data-colour-code", colourInfo.code).attr("style", "width:calc(" + app.def.colourBarWidth + "px/" + app.def.colourBarLength + "); background: " + colourInfo.colour + ";");
        }

    });

    $(document).on("click", "#mainForm [href='#colourModule']", (e) => {
        if($("#mainForm #colourModule").is(":visible") === false){
            $(e.currentTarget).find("strong").text("Aktif");
            app.def.customizedColours = true;
        }else {
            $(e.currentTarget).find("strong").text("Pasif");
            app.def.customizedColours = false;
        }
    });

    $(document).on("click", "#colourModule [data-selector='symmetrical-colouring']", (e) => {
        if(app.def.symmetricalColouring === false){
            $(e.currentTarget).removeClass("btn-secondary").addClass("btn-primary");
            $(e.currentTarget).find("strong").text("Aktif");
            app.def.symmetricalColouring = true;
        }else{
            $(e.currentTarget).removeClass("btn-primary").addClass("btn-secondary");
            $(e.currentTarget).find("strong").text("Pasif");
            app.def.symmetricalColouring = false;
        }
    });

    $(document).on("click", ".product-right [data-selector='add-to-cart']", async (e) => {

        if(app.def.addToCartLock !== false && app.func.activated() !== false){

            e.preventDefault();
            e.stopImmediatePropagation();
            loadMainPopup();

            if(app.def.optionalRollerBlind !== false){

                let categoryItem = new Object();
                categoryItem = {
                    type: "0",
                    catalog: app.def.popup.func.FICatalog(app.def.optionalRollerBlind)
                }
                
                const popup = await app.func.getform(app.def.formsPath+"additional_info.php", {categoryItem: JSON.stringify(categoryItem), thisProduct: JSON.stringify({stockTypeLabel: thisProduct.stockTypeLabel, currency: thisProduct.currency}), app: JSON.stringify({square: app.val.square, unit: app.val.unit})});
                $("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(0)").addClass("d-none").removeClass("d-grid");
                $("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(0)").before($(popup));
                app.def.popup.pageLength++;

                if(typeof $("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(0)").attr("data-category-name") !== "undefined"){
                    let categoryName = $("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(0)").attr("data-category-name");
                    $("#extensionPopup .popup #header h4").text(categoryName);
                }

            }
        }

        app.def.addToCartLock = true;

    });

    $(document).on("click", "#extensionPopup .popup [data-wrapper='additional-info'] [data-wrapper='BeadOrTasselModel'] [data-selector='iDontWantBeadOrTasselModel']", (e) => {
        $(e.currentTarget).parents("[data-wrapper='BeadOrTasselModel']").find("a.btn-primary").removeClass("btn-primary").addClass("btn-secondary");
        $(e.currentTarget).addClass("btn-primary").removeClass("btn-secondary");
        app.def.popup.beadOrTasselModel = false;
        if($("#extensionPopup .popup .body [data-wrapper='additional-info'][data-index='-2']").length !== 0){
            app.def.popup.pageLength--;
            $("#extensionPopup .popup .body [data-wrapper='additional-info'][data-index='-1']").remove();
            $("#extensionPopup .popup .body [data-wrapper='additional-info'][data-index='-2']").attr("data-index", "-1");
            app.def.popup.beadOrTasselModelTwice = false;
        }
        if(doubleBreastedOrPleatedPlanting !== false){
            if(app.def.popup.pageLength < 2){
                $("#extensionPopup #display [data-selector='next']").removeClass("d-flex").addClass("d-none");
                $("#extensionPopup #display [data-selector='add-to-cart2']").removeClass("d-none").addClass("d-flex");
            }
        }
        app.func.calculate();
    });

    $(document).on("click", "#extensionPopup .popup [data-wrapper='additional-info'] [data-wrapper='BeadOrTasselModel'] [data-selector='iWantBeadModel']", (e) => {
        $(e.currentTarget).parents("[data-wrapper='BeadOrTasselModel']").find("a.btn-primary").removeClass("btn-primary").addClass("btn-secondary");
        $(e.currentTarget).addClass("btn-primary").removeClass("btn-secondary");
        app.def.popup.beadOrTasselModel = 6;
        if($("#extensionPopup .popup .body [data-wrapper='additional-info'][data-index='-2']").length !== 0){
            app.def.popup.pageLength--;
            $("#extensionPopup .popup .body [data-wrapper='additional-info'][data-index='-1']").remove();
            $("#extensionPopup .popup .body [data-wrapper='additional-info'][data-index='-2']").attr("data-index", "-1");
            app.def.popup.beadOrTasselModelTwice = false;
        }
        if(doubleBreastedOrPleatedPlanting !== false){
            if(app.def.popup.pageLength < 2){
                $("#extensionPopup #display [data-selector='next']").removeClass("d-none").addClass("d-flex");
                $("#extensionPopup #display [data-selector='add-to-cart2']").removeClass("d-flex").addClass("d-none");
            }
        }
        app.func.calculate();
    });

    $(document).on("click", "#extensionPopup .popup [data-wrapper='additional-info'] [data-wrapper='BeadOrTasselModel'] [data-selector='iWantTasselModel']", (e) => {
        $(e.currentTarget).parents("[data-wrapper='BeadOrTasselModel']").find("a.btn-primary").removeClass("btn-primary").addClass("btn-secondary");
        $(e.currentTarget).addClass("btn-primary").removeClass("btn-secondary");
        app.def.popup.beadOrTasselModel = 19;
        if($("#extensionPopup .popup .body [data-wrapper='additional-info'][data-index='-2']").length !== 0){
            app.def.popup.pageLength--;
            $("#extensionPopup .popup .body [data-wrapper='additional-info'][data-index='-1']").remove();
            $("#extensionPopup .popup .body [data-wrapper='additional-info'][data-index='-2']").attr("data-index", "-1");
            app.def.popup.beadOrTasselModelTwice = false;
        }
        if(doubleBreastedOrPleatedPlanting !== false){
            if(app.def.popup.pageLength < 2){
                $("#extensionPopup #display [data-selector='next']").removeClass("d-none").addClass("d-flex");
                $("#extensionPopup #display [data-selector='add-to-cart2']").removeClass("d-flex").addClass("d-none");
            }
        }
        app.func.calculate();
    });

    $(document).on("click", "#extensionPopup .popup [data-wrapper='additional-info'] [data-wrapper='numberOfWing'] .btn", (e) => {
        $(e.currentTarget).parents(".row:eq(0)").find(".btn.btn-primary").removeClass("btn-primary").addClass("btn-secondary");
        $(e.currentTarget).addClass("btn-primary").removeClass("btn-secondary");

        if($(e.currentTarget).attr("data-selector") === "doubleWing"){
            app.def.popup.numberOfWing = 2;
            $(e.currentTarget).parents("[data-wrapper='additional-info']").find("[data-wrapper='wingDirection'] a").addClass("disabled");
            $(e.currentTarget).parents("[data-wrapper='additional-info']").find("[data-wrapper='wingDirection'] .btn-primary").removeClass("btn-primary").addClass("btn-secondary");
        }else if($(e.currentTarget).attr("data-selector") === "singleWing"){
            $(e.currentTarget).parents("[data-wrapper='additional-info']").find("[data-wrapper='wingDirection'] a.disabled").removeClass("disabled");
            $(e.currentTarget).parents("[data-wrapper='additional-info']").find("[data-wrapper='wingDirection'] a:eq(0)").removeClass("btn-secondary").addClass("btn-primary");
            app.def.popup.numberOfWing = 1;
        }
        app.func.calculate();
    });

    $(document).on("click", "#extensionPopup .popup [data-wrapper='additional-info'] [data-wrapper='wingDirection'] .btn", (e) => {
        $(e.currentTarget).parents("[data-wrapper='wingDirection']").find(".btn.btn-primary").removeClass("btn-primary").addClass("btn-secondary");
        $(e.currentTarget).addClass("btn-primary").removeClass("btn-secondary");
    });

    $(document).on("click", "#extensionPopup .popup .buttons [data-selector='next']", async (e) => {
        let optionalRollerBlindRequired = (typeof app.def.additionalInfo["Opsiyonel Stor Perde"] !== "undefined") ? (app.def.additionalInfo["Opsiyonel Stor Perde"].indexOf("/") !== -1) ? 1 : 0 : false;
        if(app.def.optionalRollerBlind !== false && optionalRollerBlindRequired === 1 && $("#extensionPopup .popup [data-wrapper='additional-info']:eq(0) [data-selector='checkbox'].btn-primary").length === 0){
            Swal.fire({
                icon: 'warning',
                title: 'Zorunlu Alan!',
                text: "Lütfen bir seçim yapınız.",
                confirmButtonText: 'Tamam'
            });
            return false;
        }

        if(app.def.popup.beadOrTasselModel !== false && app.def.popup.beadOrTasselModelTwice === false){
            
            app.def.popup.beadOrTasselModelTwice = true;
            
            let categoryItem = new Object();
            switch (app.def.popup.beadOrTasselModel) {
                case 6:
                    categoryItem = {
                        type: "0",
                        catalog: app.def.popup.func.FICatalog(app.def.popup.beadOrTasselModel)
                    };
                    break;
                case 19:
                    categoryItem = {
                        type: "0",
                        catalog: app.def.popup.func.FICatalog(app.def.popup.beadOrTasselModel)
                    };
                    break;
            }

            const popup = await app.func.getform(app.def.formsPath+"additional_info.php", {categoryItem: JSON.stringify(categoryItem), thisProduct: JSON.stringify({stockTypeLabel: thisProduct.stockTypeLabel, currency: thisProduct.currency}), app: JSON.stringify({square: app.val.square, unit: app.val.unit})});
            app.def.popup.pageLength++;
            $("#extensionPopup .popup .body [data-wrapper='additional-info'][data-index='-1']").attr("data-index", "-2");
            $("#extensionPopup .popup .body [data-wrapper='additional-info'][data-index='-2']").after($(popup));
            $("#extensionPopup .popup .buttons [data-selector='previous']").removeClass("d-none").addClass("d-flex");
            if(doubleBreastedOrPleatedPlanting !== false){
                if(app.def.popup.pageLength < 3){
                    $("#extensionPopup #display [data-selector='next']").removeClass("d-flex").addClass("d-none");
                    $("#extensionPopup #display [data-selector='add-to-cart2']").removeClass("d-none").addClass("d-flex");
                }
            }
        }

        if(app.def.popup.beadOrTasselModel !== false && app.def.popup.page === 1){
            if($("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(" + app.def.popup.page + ") .btn-primary").length === 0){
                Swal.fire({
                    icon: 'warning',
                    title: 'Zorunlu Alan!',
                    text: "Lütfen bir seçim yapınız.",
                    confirmButtonText: 'Tamam',
                });
                return false;
            }
        }

        if(app.def.popup.page < app.def.popup.pageLength - 1){
            app.def.popup.page++;
            if(app.def.popup.page === app.def.popup.pageLength - 1){
                $(e.currentTarget).removeClass("d-flex").addClass("d-none");
                $(e.currentTarget).parent().find("[data-selector='add-to-cart2']").removeClass("d-none").addClass("d-flex");
            }
        }else{
            return false;
        }

        $("#extensionPopup .popup .body [data-wrapper='additional-info']").each((index, elem) => {
            if($(elem).hasClass("d-none") === false){
                $(elem).removeClass("d-grid").addClass("d-none");
            }
        });

        $("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(" + app.def.popup.page + ")").removeClass("d-none").addClass("d-grid");
        $(e.currentTarget).parent().find("[data-selector='previous']").removeClass("d-none").addClass("d-flex");

        if(typeof $("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(" + app.def.popup.page + ")").attr("data-category-name") !== "undefined"){
            let categoryName = $("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(" + app.def.popup.page + ")").attr("data-category-name");
            $("#extensionPopup .popup #header h4").text(categoryName);
        }

    });

    $(document).on("click", "#extensionPopup .popup .buttons [data-selector='previous']", (e) => {

        app.def.popup.page--;

        if(app.def.popup.page === 0){
            $(e.currentTarget).addClass("d-none").removeClass("d-flex");
        }

        if(app.def.popup.page !== app.def.popup.pageLength - 1){
            let target = $(e.currentTarget).parent().find("[data-selector='next']");
            if(target.hasClass("d-flex") === false){
                target.addClass("d-flex").removeClass("d-none");
                $(e.currentTarget).parent().find("[data-selector='add-to-cart2']").addClass("d-none").removeClass("d-flex");
            }
        }

        $("#extensionPopup .popup .body [data-wrapper='additional-info']").each((index, elem) => {
            if($(elem).hasClass("d-none") === false){
                $(elem).removeClass("d-grid").addClass("d-none");
            }
        });

        $("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(" + app.def.popup.page + ")").removeClass("d-none").addClass("d-grid");

        if(typeof $("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(" + app.def.popup.page + ")").attr("data-category-name") !== "undefined"){
            let categoryName = $("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(" + app.def.popup.page + ")").attr("data-category-name");
            $("#extensionPopup .popup #header h4").text(categoryName);
        }

    });

    $(document).on("click", "#extensionPopup .popup .body [data-wrapper='additional-info'] [data-selector='only-use-tulle']", (e) => {
        $(e.currentTarget).parents(".row:eq(0)").find(".btn-primary").removeClass("btn-primary").addClass("btn-secondary");
        $(e.currentTarget).removeClass("btn-secondary").addClass("btn-primary");
        $(e.currentTarget).parents("[data-wrapper='additional-info']:eq(0)").find("[data-selector='checkbox'].btn-primary").trigger("click").trigger("click");
    });

    $(document).on("click", "#extensionPopup .popup .body [data-wrapper='additional-info'] [data-selector='use-with-roller-blind']", (e) => {
        $(e.currentTarget).parents(".row:eq(0)").find(".btn-primary").removeClass("btn-primary").addClass("btn-secondary");
        $(e.currentTarget).removeClass("btn-secondary").addClass("btn-primary");
        $(e.currentTarget).parents("[data-wrapper='additional-info']:eq(0)").find("[data-selector='checkbox'].btn-primary").trigger("click").trigger("click");
    });

    $(document).on("click", ".product-right #extensionPopup .popup [data-wrapper='additional-info'] [data-selector='checkbox']", (e) => {
        
        let quantity = 0;

        let id = $(e.currentTarget).parent().attr("data-product-id");
        let stockType = $(e.currentTarget).parent().attr("data-product-stocktype");
        let cId = $(e.currentTarget).parent().attr("data-category-id");
        let type = $(e.currentTarget).parent().attr("data-calculate-type");
        let price = $(e.currentTarget).parent().attr("data-product-price");
        let name = $(e.currentTarget).parent().attr("data-product-name");
        price = parseFloat(parseFloat(price).toFixed(2));

        if($(e.currentTarget).hasClass("btn-primary") === false){

            $(e.currentTarget).parents("#itemsContainer").find("[data-selector='checkbox'].btn-primary").removeClass("btn-primary").addClass("btn-secondary");
            $(e.currentTarget).addClass("btn-primary").removeClass("btn-secondary");

            if(price === 1 || price === 1.18 || price === 1.08){
                quantity = 0;
            }else{
                if(stockType === "m2"){
                    if(type === "en"){
                        quantity = app.val.width * 0.01;
                    }else if(type === "boy"){
                        quantity = app.val.height * 0.01;
                    }else{
                        quantity = app.val.square;
                    }
                }else if(stockType === "metre"){
                    if(type === "boy"){
                        quantity = app.val.height * 0.01;
                    }else{
                        quantity = app.val.width * 0.01;
                    }
                }else{
                    quantity = 1;
                }
            }

            if($(e.currentTarget).parents("[data-wrapper='additional-info']:eq(0)").find("[data-selector='use-with-roller-blind'].btn-primary").length > 0){
                quantity = quantity * 2;
            }

            price = price * quantity;
            app.def.popup.additionalProduct[cId] = {
                id: id,
                name: name,
                price: price,
                quantity: quantity
            }

        }else{

            if(typeof app.def.popup.additionalProduct[cId] !== "undefined"){
                delete app.def.popup.additionalProduct[cId];
            };

            $(e.currentTarget).removeClass("btn-primary").addClass("btn-secondary");

        }

        let additionalUnit = 0;
        for (const key in app.def.popup.additionalProduct) {
            additionalUnit += app.def.popup.additionalProduct[key].price;
        }

        let totalPrice = app.val.unit + additionalUnit;
        $("#extensionPopup .popup #display [data-selector='display-unit']").text(app.func.numberFormat(totalPrice, 2, ",", ".") + " " + thisProduct.currency);

    });

    $(document).on("click", "#extensionPopup .popup .buttons [data-selector='add-to-cart2']", async (e) => {

        if(doubleBreastedOrPleatedPlanting !== false){
            if(app.def.popup.pageLength < 3){
                if($("#extensionPopup .popup .body [data-wrapper='additional-info']:eq(" + app.def.popup.page + ") .btn-primary").length === 0){
                    Swal.fire({
                        icon: 'warning',
                        title: 'Zorunlu Alan!',
                        text: "Lütfen bir seçim yapınız.",
                        confirmButtonText: 'Tamam',
                    });
                    return false;
                }
            }
        }

        let key = "", temp = "";
        let customization = $(".product-customization-group[data-group-id='1'] textarea");

        await app.func.asyncForEach(app.def.popup.additionalProduct, (elem) => {
            if(elem.quantity !== 0){
                IdeaCart.addItem($(e.currentTarget), {productId: parseInt(elem.id), quantity: elem.quantity});
            }
        });

        app.def.popup.customizationFormFields.variables = new Array();
        app.def.popup.customizationFormFields.paid = new Array();
        app.def.popup.customizationFormFields.unpaid = new Array();
        customization.val(null).trigger("change");

        app.def.popup.customizationFormFields.variables.push(
            { key: "En", value: app.real.width + "cm" }, { key: "Boy", value: app.real.height + "cm" }, { key: "Ebat", value: app.val.square + thisProduct.stockTypeLabel }
        );
        if(!isNaN(app.val.pileRate) && app.val.pileRate !== 0){
            app.def.popup.customizationFormFields.variables.push({key: "Pile", value: app.val.pileRate});
        }

        await app.func.asyncForEach2($("#extensionPopup .popup .body [data-wrapper='additional-info'] .btn-primary"), (elem) => {
            if($(elem).length){
                if(typeof $(elem).attr("data-selector") !== "undefined" && $(elem).attr("data-selector") === "checkbox"){
                    if(parseFloat($(elem).parent().attr("data-product-price")).toFixed(2) === "1.00" || parseFloat($(elem).parent().attr("data-product-price")).toFixed(2) === "1.18" || parseFloat($(elem).parent().attr("data-product-price")).toFixed(2) === "1.08"){
                        app.def.popup.customizationFormFields.unpaid.push({key: "Ücretsiz", value: $(elem).parent().attr("data-product-name")});
                    }else{
                        app.def.popup.customizationFormFields.paid.push({key: "Ücretli", value: $(elem).parent().attr("data-product-name")});
                    }
                }else{
                    key = $(elem).parents("[data-wrapper='additional-info']").attr("data-category-name");
                    if(typeof app.def.popup.customizationFormFields[key] === "undefined"){
                        app.def.popup.customizationFormFields[key] = new Array();
                    }
                    temp = $(elem).parents("[data-wrapper]:eq(0)").attr("data-wrapper");
                    temp = (temp === "BeadOrTasselModel") ? "Püskül, Boncuk" : (temp === "numberOfWing") ? "Kanat Sayısı" : (temp === "wingDirection") ? "Kanat Yönü" : false;
                    app.def.popup.customizationFormFields[key].push({key:temp, value: $(elem).text().trim()});
                }
            }
        });
        
        await app.func.asyncForEach(app.def.popup.customizationFormFields, (elem) => {
            elem.forEach(element => {
                customization.val(customization.val() + "- " + element.value + "(" + element.key + ")\n").trigger("change");
            });
        });

        customization.val(customization.val() + "- uniqId: " + app.func.uuidv4()).trigger("change");

        if(app.def.customizedColours !== false){
            let colours = "";
            let counter = 1;
            await app.func.asyncForEach2($("#mainForm #colourModule [data-wrapper='colourChoiceBars'] .bar-item"), (elem) => {
                if($(elem).length){
                    colours += "-" + counter + ">" + $(elem).attr("data-colour") + ">" + $(elem).attr("data-colour-code") + "\n";
                    counter++;
                }
            });
            customization.val(customization.val() + colours).trigger("change");
        }

        app.def.addToCartLock = false;
        $(".product-qty-wrapper .product-qty>div input").val(app.def.product.mainProductQuantity).trigger("change");
        $(".product-right [data-selector='add-to-cart'].add-to-cart-button").attr("data-quantity", app.def.product.mainProductQuantity).trigger("click");
        $("#extensionPopup .popup .buttons [data-selector='cancel']").trigger("click");
        setTimeout(() => { $("#header [data-selector='cart-item-count']").parent().trigger("click"); }, 1500);
    });

    $(document).on("click", "#extensionPopup .popup .buttons [data-selector='cancel']", (e) => {
        app.def.popup.page = 0;
        app.def.popup.beadOrTasselModel = false;
        app.def.popup.numberOfWing = 2;
        app.func.calculate();
        $("#extensionPopup").remove();
        $("body").removeClass("overflow-hidden");
    });

})(jQuery);
