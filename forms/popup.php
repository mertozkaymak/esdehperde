<?php 
    header("Access-Control-Allow-Origin: *");
    $thisProduct = json_decode($_POST["thisProduct"], true);
    $app = json_decode($_POST["app"], true);

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
<div class="container d-flex justify-content-center align-items-center" id="extensionPopup">
    <div class="popup position-relative">
        <div class="row d-flex align-items-center font-weight-bold m-0" id="header">
            <h4 class="ml-5 mt-4"></h4>
        </div>
        <div class="d-block d-sm-flex w-100 p-3" id="display">
            <div class="col-12 col-sm-6 d-flex justify-content-between justify-content-sm-start align-items-center mb-4 mb-sm-0 text-center">
                <span class="mr-3 p-3 border d-flex justify-content-center align-items-center">
                    <i class="fas fa-ruler mr-3"></i>
                    <span class="mr-3 d-none d-md-flex">EBAT |</span>
                    <strong data-selector="display-square">
                        <?php
                            switch ($app["def"]["popup"]["calculateType"]) {
                                case 'Lazer Kesim Stor':
                                    echo number_format(intval($app["val"]["width"]) * 0.01, 2, ",", ".");
                                    break;
                                default:
                                    echo number_format($app["val"]["square"], 2, ",", ".");
                                    break;
                            }
                        ?>
                        <?= $thisProduct["stockTypeLabel"] ?>
                    </strong>
                </span>
                <span class="mr-3 p-3 border d-flex justify-content-center align-items-center">
                    <i class="fas fa-coins mr-3"></i>
                    <span class="mr-3 d-none d-md-flex">TOPLAM |</span>
                    <strong data-selector="display-unit"><?= number_format($app["val"]["unit"], 2, ",", ".") ?> <?= $thisProduct["currency"] ?></strong>
                </span>
            </div>
            <div class="col-12 col-sm-6 d-flex justify-content-between justify-content-sm-end align-items-center buttons">
                <a href="javascript:void(0);" class="btn d-flex justify-content-center align-items-center btn-secondary btn-sm mr-3" data-selector='cancel'>
                    <i class="fas fa-times mr-0 mr-sm-3"></i>
                    <span class="d-none d-sm-flex">İPTAL</span>
                </a>
                <a href="javascript:void(0);" class="btn d-none justify-content-center align-items-center btn-primary btn-sm mr-3" data-selector='previous'>
                    <i class="fas fa-arrow-left mr-0 mr-sm-3"></i>
                    <span class="d-none d-sm-flex">Önceki</span>
                </a>
                <a href="javascript:void(0);" class="btn <?= (count($app["def"]["popup"]["categoryItems"]) < 2) ? 'd-none' : 'd-flex' ?> justify-content-center align-items-center btn-primary btn-sm" data-selector='next'>
                    <span class="d-none d-sm-flex">Sonraki</span>
                    <i class="fas fa-arrow-right ml-0 ml-sm-3"></i>
                </a>
                <a href="javascript:void(0);" class="btn <?= (count($app["def"]["popup"]["categoryItems"]) < 2) ? 'd-flex' : 'd-none' ?> justify-content-center align-items-center btn-primary add-to-cart-button btn-sm" data-selector='add-to-cart2'>
                    <i class="fas fa-shopping-cart mr-0 mr-sm-3"></i>
                    <span class="d-none d-sm-flex">SEPETE EKLE</span>
                </a>
            </div>
        </div>
        <div class="row body m-0 p-3" id="main">
            <?php
                if($app["def"]["popup"]["doubleBreasted"]){
                    echo '<div class="col-12" data-wrapper="additional-info" data-category-name="Kanat, Püskül, Boncuk" data-index="-1">
                        <div class="row mb-5" data-wrapper="BeadOrTasselModel">
                            <div class="col-12 mb-3">
                                <h5 class="m-0">Perdenizin Ucuna Boncuk veya Püskül (Saçak) İstiyor musunuz?</h5>
                            </div>
                            <div class="col-12 mb-3">
                                *Seçiminize göre bir sonraki ekranda boncuk ya da püskül(saçak) listesi gelecektir.
                            </div>
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-4">
                                        <a href="javascript:void(0);" class="btn btn-primary d-flex justify-content-between align-items-center w-100" data-selector="iDontWantBeadOrTasselModel">
                                            <i class="fas fa-check"></i>
                                            İstemiyorum
                                        </a>
                                    </div>
                                    <div class="col-4">
                                        <a href="javascript:void(0);" class="btn btn-secondary d-flex justify-content-between align-items-center w-100" data-selector="iWantBeadModel">
                                            <i class="fas fa-check"></i>
                                            Boncuk İstiyorum
                                        </a>
                                    </div>
                                    <div class="col-4">
                                        <a href="javascript:void(0);" class="btn btn-secondary d-flex justify-content-between align-items-center w-100" data-selector="iWantTasselModel">
                                            <i class="fas fa-check"></i>
                                            Püskül(Saçak) İstiyorum
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-5" data-wrapper="numberOfWing">
                            <div class="col-12 mb-3">
                                <h5 class="m-0">Kanat Sayısı</h5>
                            </div>
                            <div class="col-12 mb-3">
                                *Perdenizde istediğiniz kanat sayınızı seçiniz
                            </div>
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <a href="javascript:void(0);" class="btn btn-primary d-flex justify-content-between align-items-center w-100" data-selector="doubleWing">
                                            <i class="fas fa-check"></i>
                                            Çift Kanat
                                        </a>
                                    </div>
                                    <div class="col-6">
                                        <a href="javascript:void(0);" class="btn btn-secondary d-flex justify-content-between align-items-center w-100" data-selector="singleWing">
                                            <i class="fas fa-check"></i>
                                            Tek Kanat
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-5" data-wrapper="wingDirection">
                            <div class="col-12 mb-3">
                                <h5 class="m-0">Kanat Yönü</h5>
                            </div>
                            <div class="col-12 mb-3">
                                *Perdenizin kanat yönünü seçiniz ( Tek kanat seçiminde aktif olacaktır ).
                            </div>
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="row m-0 mb-3">
                                            <a href="javascript:void(0);" class="btn btn-secondary d-flex justify-content-between align-items-center w-100 disabled" data-selector="leftWing">
                                                <i class="fas fa-check"></i>
                                                Sol Kanat
                                            </a>
                                        </div>
                                        <div class="row m-0">
                                            <a href="***/dosya/PerdeModülü/kruvaze-sol-kanat.png" data-lightbox="roadtrip" class="w-100">
                                                <img src="***/dosya/PerdeModülü/kruvaze-sol-kanat.png" class="img-fluid border"/>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="row m-0 mb-3">
                                            <a href="javascript:void(0);" class="btn btn-secondary d-flex justify-content-between align-items-center w-100 disabled" data-selector="rightWing">
                                                <i class="fas fa-check"></i>
                                                Sağ Kanat
                                            </a>
                                        </div>
                                        <div class="row m-0">
                                            <a href="***/dosya/PerdeModülü/kruvaze-sag-kanat.png" data-lightbox="roadtrip" class="w-100">
                                                <img src="***/dosya/PerdeModülü/kruvaze-sag-kanat.png" class="img-fluid border"/>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>';
                }
                if($_POST["wingDirectionChoice"] === "1"){
                    echo '<div class="col-12" data-wrapper="additional-info" data-category-name="Kanat Sayısı" data-index="-1">
                        <div class="row mb-5" data-wrapper="numberOfWing">
                            <div class="col-12 mb-3">
                                <h5 class="m-0">Kanat Sayısı</h5>
                            </div>
                            <div class="col-12 mb-3">
                                *Perdenizde istediğiniz kanat sayınızı seçiniz
                            </div>
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <a href="javascript:void(0);" class="btn btn-primary d-flex justify-content-between align-items-center w-100" data-selector="doubleWing">
                                            <i class="fas fa-check"></i>
                                            Çift Kanat
                                        </a>
                                    </div>
                                    <div class="col-6">
                                        <a href="javascript:void(0);" class="btn btn-secondary d-flex justify-content-between align-items-center w-100" data-selector="singleWing">
                                            <i class="fas fa-check"></i>
                                            Tek Kanat
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-5" data-wrapper="wingDirection">
                            <div class="col-12 mb-3">
                                <h5 class="m-0">Kanat Yönü</h5>
                            </div>
                            <div class="col-12 mb-3">
                                *Perdenizin kanat yönünü seçiniz ( Tek kanat seçiminde aktif olacaktır ).
                            </div>
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="row m-0 mb-3">
                                            <a href="javascript:void(0);" class="btn btn-secondary d-flex justify-content-between align-items-center w-100 disabled" data-selector="leftWing">
                                                <i class="fas fa-check"></i>
                                                Sol Kanat
                                            </a>
                                        </div>
                                        <div class="row m-0">
                                            <a href="***/dosya/PerdeModülü/kruvaze-sol-kanat.png" data-lightbox="roadtrip" class="w-100">
                                                <img src="***/dosya/PerdeModülü/kruvaze-sol-kanat.png" class="img-fluid border"/>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="row m-0 mb-3">
                                            <a href="javascript:void(0);" class="btn btn-secondary d-flex justify-content-between align-items-center w-100 disabled" data-selector="rightWing">
                                                <i class="fas fa-check"></i>
                                                Sağ Kanat
                                            </a>
                                        </div>
                                        <div class="row m-0">
                                            <a href="***/dosya/PerdeModülü/kruvaze-sag-kanat.png" data-lightbox="roadtrip" class="w-100">
                                                <img src="***/dosya/PerdeModülü/kruvaze-sag-kanat.png" class="img-fluid border"/>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>';
                }
                
                $counter = 0;
                foreach($app["def"]["popup"]["categoryItems"] as $items){
                    if(!$app["def"]["popup"]["doubleBreasted"]){
                        if($_POST["wingDirectionChoice"] === "1"){
                            echo '<div class="col-12 d-none align-items-end"';
                        }else{
                            if($counter === 0){
                                echo '<div class="col-12 d-grid align-items-end"';
                            }else{
                                echo '<div class="col-12 d-none align-items-end"';
                            }
                        }
                    }else{
                        echo '<div class="col-12 d-none align-items-end"';
                    }
                    echo ' data-wrapper="additional-info" data-category-name="' . $items["catalog"]["categoryName"] . '" data-category-id="' . $items["catalog"]["categoryId"] . '" data-index="' . $counter . '">';
                    if(in_array($items["catalog"]["categoryId"], $app["def"]["popup"]["tulleRollerBlindApplicationTypeCategories"]) && $_POST["optionalRollerBlind"] !== "false"){
                        echo '<div class="px-3 mb-5">
                            <div class="row m-0 py-3">
                                <h5 class="mb-0"><span class="mr-2" id="header"></span>Uygulama Şekli?</h5>
                            </div>
                            <div class="row m-0 py-3">
                                <div class="col-6 pl-0">
                                    <a href="javascript:void(0);" class="btn btn-primary d-flex justify-content-between w-100" data-selector="only-use-tulle">
                                        <i class="fas fa-check"></i> Sadece Tüle Uygulansın.
                                    </a>
                                </div>
                                <div class="col-6 pr-0">
                                    <a href="javascript:void(0);" class="btn btn-secondary d-flex justify-content-between w-100" data-selector="use-with-roller-blind">
                                        <i class="fas fa-check"></i> Hem Tüle Hem Stora Uygulansın.
                                    </a>
                                </div>
                            </div>
                        </div>';
                    }
                    echo '<div class="row m-0 px-3" id="itemsContainer">';
                        for ($index=0; $index < count($items["catalog"]["products"]); $index++) {
                            echo '<div class="col-12 d-flex justify-content-center align-items-center mb-3">
                                <div class="card w-100 h-100 mb-3 pr-3 border-0">
                                    <div class="row g-0 m-0">
                                        <div class="col-md-4 d-flex justify-content-around align-items-center">
                                            <img src="' . $items["catalog"]["products"][$index]["image"] . '" class="img-fluid rounded-start mt-3" style="width: 160px; height: 120px;" />
                                            <div class="d-grid align-items-center h-100 mt-3" data-wrapper="image-buttons">
                                                <div class="row">
                                                    <a href="' . $items["catalog"]["products"][$index]["image"] . '" data-lightbox="roadtrip" class="d-flex justify-content-center align-items-center border">
                                                        <i class="fas fa-search-plus"></i>
                                                    </a>
                                                </div>
                                                <div class="row">
                                                    <i class="fas fa-video d-flex justify-content-center align-items-center border"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-8 mt-3 border">
                                            <div class="card-body d-flex justify-content-between align-items-center position-relative">
                                                <p class="card-title text-center m-0 w-50" data-selector="item-amount">';
                                                if(number_format($items["catalog"]["products"][$index]["price"], 2, ',', '.') === "1,00"){
                                                    echo 'ÜCRETSİZ';
                                                }else if(number_format($items["catalog"]["products"][$index]["price"], 2, ',', '.') === "1,18"){
                                                    echo 'ÜCRETSİZ';
                                                }else if(number_format($items["catalog"]["products"][$index]["price"], 2, ',', '.') === "1,08"){
                                                    echo 'ÜCRETSİZ';
                                                }else {
                                                    echo number_format($items["catalog"]["products"][$index]["price"], 2, ',', '.') . ' ' . $items["catalog"]["products"][$index]["currency"] . ' / ' . stockTypeLabelToHtml($items["catalog"]["products"][$index]["stockType"]);
                                                }
                                                echo '</p>
                                                <p class="card-text text-center" data-selector="item-name">' . $items["catalog"]["products"][$index]["name"] . '</p>
                                            </div>
                                            <div class="card-footer d-flex justify-content-center" data-product-id="' . $items["catalog"]["products"][$index]["id"] . '" data-category-id="' . $items["catalog"]["categoryId"] . '" data-product-price="' . $items["catalog"]["products"][$index]["price"] . '" data-product-stockType="' . $items["catalog"]["products"][$index]["stockType"] . '" data-calculate-type="' . $items["type"] . '" data-product-name="' . $items["catalog"]["products"][$index]["name"] . '">
                                                <span class="btn btn-secondary w-50 border d-flex justify-content-center align-items-baseline mr-3" data-selector="checkbox">
                                                    <i class="fas fa-plus mr-3"></i>
                                                    ÜRÜN SEPETE EKLE
                                                </span>
                                                <a href="' . $items["catalog"]["products"][$index]["slug"] . '" target="_blank" class="d-flex justify-content-center align-items-center w-50" data-selector="goto-product-page">
                                                    <u>ÜRÜN SAYFASINA GİT</u>
                                                    <i class="fas fa-arrow-right ml-3"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>';
                        }
                        echo '</div>
                    </div>';

                    $counter++;
                    
                }
            ?>
        </div>
    </div>
</div>
