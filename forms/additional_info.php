<?php
    header("Access-Control-Allow-Origin: *");
    $categoryItem = json_decode($_POST["categoryItem"], true)["catalog"];
    $calculateType = json_decode($_POST["categoryItem"], true)["type"];
    $app = json_decode($_POST["app"], true);
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
<div class="col-12 align-items-end" data-wrapper="additional-info" data-category-name="<?=$categoryItem["categoryName"]?>" data-category-id="<?=$categoryItem["categoryId"]?>" data-index="-1">
    <div class="row m-0 px-3" id="itemsContainer">
        <?php
            foreach($categoryItem["products"] as $items){
                echo '<div class="col-12 d-flex justify-content-center align-items-center mb-3">
                    <div class="card w-100 h-100 mb-3 pr-3 border-0">
                        <div class="row g-0 m-0">
                            <div class="col-md-4 d-flex justify-content-around align-items-center">
                                <img src="' . $items["image"] . '" class="img-fluid rounded-start mt-3" style="width: 160px; height: 120px;" />
                                <div class="d-grid align-items-center h-100 mt-3" data-wrapper="image-buttons">
                                    <div class="row">
                                        <a href="' . $items["image"] . '" data-lightbox="roadtrip" class="d-flex justify-content-center align-items-center border">
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
                                    if(number_format($items["price"], 2, ',', '.') === "1,00"){
                                        echo 'ÜCRETSİZ';
                                    }else if(number_format($items["price"], 2, ',', '.') === "1,18"){
                                        echo 'ÜCRETSİZ';
                                    }else if(number_format($items["catalog"]["products"][$index]["price"], 2, ',', '.') === "1,08"){
                                        echo 'ÜCRETSİZ';
                                    }else{
                                        echo number_format($items["price"], 2, ',', '.') . ' ' . $items["currency"] . ' / ' . stockTypeLabelToHtml($items["stockType"]);
                                    }
                                    echo '</p>
                                    <p class="card-text text-center" data-selector="item-name">' . $items["name"] . '</p>
                                </div>
                                <div class="card-footer d-flex justify-content-center" data-product-id="' . $items["id"] . '" data-category-id="' . $categoryItem["categoryId"] . '" data-product-price="' . $items["price"] . '" data-product-stockType="' . $items["stockType"] . '" data-calculate-type="' . $calculateType . '" data-product-name="' . $items["name"] . '">
                                    <span class="btn btn-secondary w-50 border d-flex justify-content-center align-items-baseline mr-3" data-selector="checkbox">
                                        <i class="fas fa-plus mr-3"></i>
                                        ÜRÜN SEPETE EKLE
                                    </span>
                                    <a href="' . $items["slug"] . '" target="_blank" class="d-flex justify-content-center align-items-center w-50" data-selector="goto-product-page">
                                        <u>ÜRÜN SAYFASINA GİT</u>
                                        <i class="fas fa-arrow-right ml-3"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>';
            }
        ?>
    </div>
</div>