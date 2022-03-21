<?php 
    header("Access-Control-Allow-Origin: *");
    $thisProduct = json_decode($_POST["thisProduct"], true);

    function stockTypeLabelToHtml($type){
        switch ($type) {
            case 'm2':
                return "m<sup>2</sup>";
                break;
            case 'metre':
                return "metre";
                break;
            case 'Piece':
                return "adet";
                break;
        }
    }
?>
<div class="container border py-3 mb-5" id="mainForm">
    <div class="row m-0 <?=($_POST["optionalRollerBlind"] !== "false") ? 'mb-3' : 'mb-5'?>">
        <div class="col-6 pl-0">
            <select class="form-control" id="width">
                <option>En seçiniz.</option>
            </select>
        </div>
        <div class="col-6 pr-0">
            <select class="form-control" id="height">
                <option>Boy seçiniz.</option>
            </select>
        </div>
    </div>
    <?php
        if($_POST["doubleBreastedOrPleatedPlanting"] === "1"){
            echo '<div class="row m-0 mb-5" id="doubleBreastedOrPleatedPlanting">
                <div class="col-6 pl-0">
                    <div class="row m-0">
                        <a href="javascript:void(0);" class="btn btn-secondary d-flex justify-content-between align-items-center w-100 mb-3" data-selector="pleatedPlanting">
                            <i class="fas fa-check"></i>
                            Pileli Dikim
                        </a>
                    </div>
                    <div class="row m-0">
                        <a href="***/dosya/PerdeModülü/duz-model.png" data-lightbox="roadtrip" class="w-100">
                            <img src="***/dosya/PerdeModülü/duz-model.png" class="img-fluid border"/>
                        </a>
                    </div>
                </div>
                <div class="col-6 pr-0">
                    <div class="row m-0">
                        <a href="javascript:void(0);" class="btn btn-primary d-flex justify-content-between align-items-center w-100 mb-3" data-selector="doubleBreastedPlanting">
                            <i class="fas fa-check"></i>
                            Kruvaze Dikim
                        </a>
                    </div>
                    <div class="row m-0">
                        <a href="***/dosya/PerdeModülü/kruvaze-perde-modeli.png" data-lightbox="roadtrip" class="w-100">
                            <img src="***/dosya/PerdeModülü/kruvaze-perde-modeli.png" class="img-fluid border"/>
                        </a>
                    </div>
                </div>
            </div>';
        }else if($_POST["doubleBreastedOrPleatedPlanting"] === "2"){
            echo '<div class="row m-0 mb-5" id="doubleBreastedOrPleatedPlanting">
                <div class="col-12 pl-0">
                    <div class="row m-0 d-none">
                        <a href="javascript:void(0);" class="btn btn-primary d-flex justify-content-between align-items-center w-100 mb-3" data-selector="pleatedPlanting">
                            <i class="fas fa-check"></i>
                            Pileli Dikim
                        </a>
                    </div>
                    <div class="row m-0">
                        <div class="alert alert-dark w-100 text-center font-weight-bold" role="alert">
                            Bu ürüne sadece "Pileli Dikim" uygulanmaktadır.
                        </div>
                    </div>
                </div>
            </div>';
        }

        if($_POST["optionalRollerBlind"] !== "false"){
            echo '<div class="container mb-5 p-0" data-wrapper="optional-roller-blind">
                <div class="row m-0 py-3 border">
                    <div class="col-12">
                        <div class="row m-0 mb-3">
                            <a href="javascript:void(0);" class="btn btn-';
                            if($_POST["optionalRollerBlindRequired"] !== "false"){
                                echo 'primary';
                            }else{
                                echo 'secondary';
                            }
                            echo ' d-flex justify-content-between align-items-center w-100">
                                <i class="fas fa-check"></i> Arkasına '. $_POST["optionalRollerBlindName"] . ' İstiyorum.
                            </a>
                        </div>
                        <div class="row m-0 justify-content-center small font-weight-bold text-center">
                            *Sepete Ekle Aksiyonu İle Stor Modelleri Gösterilecektir.
                        </div>
                    </div>
                </div>
            </div>';
        }

        if($_POST["colourModule"] !== "false"){
            echo '<a href="#colourModule" class="btn btn-secondary bg-transparent w-100 mb-5 collapsed d-flex justify-content-center align-items-center" style="color:#FF0000;" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseExample">
                <i class="fas fa-paint-roller mr-3"></i>
                <u>Özelleştirilmiş Renkleri Kullan: <strong>Pasif</strong></u>
            </a>
            <div class="container collapse border p-0 mb-5" id="colourModule">
                    <div class="row m-0 pt-3" data-wrapper="colourPalette">
                        <div class="col-12 mt-3">Renk Seçiniz</div>
                        <div class="col-12">
                            <small>Önce bir renk seçiniz.</small>
                        </div>
                        <div class="col-12 d-flex justify-content-center flex-wrap p-0 mt-3">';
                            foreach($_POST["colourModule"] as $color){
                                if($color === "Renkli" || $color === "Seçiniz" ){
                                    continue;
                                }
                                echo '<span class="colour d-flex justify-content-between align-items-center font-weight-bold border px-3 mx-1 mb-3" data-colour="#' . explode("-", $color)[0] . '" data-colour-code="' . explode("-", $color)[1] . '">
                                    <span class="border" style="background-color: #' . explode("-", $color)[0] . ';"></span>
                                    ' . explode("-", $color)[1] . '
                                </span>';
                            }
                        echo'</div>
                    </div>
                    <div class="row m-0">
                        <div class="col-12">Alan Seçimi</div>
                        <div class="col-12">
                            <small>Renklendirilmesini istediğiniz bölgeyi seçiniz.</small>
                        </div>
                        <div class="col-12 d-flex justify-content-center flex-wrap flex-md-nowrap flex-lg-wrap flex-xl-nowrap p-0 px-3 mt-3" data-wrapper="colourChoiceBars">
                            <div class="alert alert-dark w-100 text-center font-weight-bold" role="alert">
                                En Seçimi Yapınız.
                            </div>
                        </div>
                    </div>
                    <div class="row m-0 mx-3 mx-sm-0 d-flex justify-content-center">
                        <a href="javascript:void(0);" class="btn btn-secondary col-12 col-sm-6 mb-3 d-flex justify-content-between align-items-center px-3 mt-3" data-selector="symmetrical-colouring">
                            Simetrik Renklendirme: <strong>Pasif</strong>
                        </a>
                    </div>
                </div>';
        }
    ?>
    <div class="row text-center border m-0 py-3 bg-success text-white" id="display">
        <div class="col-12 d-block d-md-none d-lg-block d-xl-none">
            <div class="row">
                <div class="col-6">
                    <div class="row d-flex justify-content-center align-items-center">
                        <span class="px-5 w-100">EBAT</span>
                    </div>
                    <div class="row d-flex justify-content-center align-items-center">
                        <span class="w-100 font-weight-bold" data-selector='square'>0,00 <?=($thisProduct) ? stockTypeLabelToHtml($thisProduct["stockTypeLabel"]) : ""?></span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="row d-flex justify-content-center align-items-center">
                        <span class="px-5 w-100">TOPLAM</span>
                    </div>
                    <div class="row d-flex justify-content-center align-items-center">
                        <span class="w-100 font-weight-bold" data-selector='total-amount'>0,00 <?=($thisProduct) ? $thisProduct["currency"] : ""?></span>
                    </div>
                </div>
                <!--<div class="col-6 d-flex justify-content-center align-items-center mb-4">
                    <span class="font-weight-bold border-right px-5 w-100">EBAT</span>
                </div>
                <div class="col-6 d-flex justify-content-center align-items-center mb-4">
                    <span class="w-100" data-selector='square'>0,00 <?=($thisProduct) ? stockTypeLabelToHtml($thisProduct["stockTypeLabel"]) : ""?></span>
                </div>
                <div class="col-6 d-flex justify-content-center align-items-center">
                    <span class="font-weight-bold border-right px-5 w-100">TOPLAM</span>
                </div>
                <div class="col-6 d-flex justify-content-center align-items-center">
                    <span class="w-100" data-selector='total-amount'>0,00 <?=($thisProduct) ? $thisProduct["currency"] : ""?></span>
                </div>-->
            </div>
        </div>
        <div class="col-12 d-none d-md-block d-lg-none d-xl-block">
            <div class="row d-flex align-items-center">
                <div class="col-3">
                    <span class="border-right px-5">EBAT</span>
                </div>
                <div class="col-3">
                    <span class="font-weight-bold" data-selector='square'>0,00 <?=($thisProduct) ? stockTypeLabelToHtml($thisProduct["stockTypeLabel"]) : ""?></span>
                </div>
                <div class="col-3">
                    <span class="border-right px-5">TOPLAM</span>
                </div>
                <div class="col-3">
                    <span class="font-weight-bold" data-selector='total-amount'>0,00 <?=($thisProduct) ? $thisProduct["currency"] : ""?></span>
                </div>
            </div>
        </div>
    </div>
</div>
