//name of JQuery function is "$"

/* Adjusting the collapsable navbar button */
//same as document.addEventListener("DOMcontentLoaded"...)
$(function () {

    //same as document.queryselector("#navbarToggle").addEventListener("blur",...)
    $("#navbarToggle").blur(function (event) {
        var screenWidth = window.innerWidth;     //browser width
        if ( screenWidth < 768 ) {
            $("#collapsable-nav").collapse('hide');
        }
    }); 

});



(function (window) {
    
    var dd =  {};
    var homeHtmlUrl = "snippets/home-snippet.html";
    var allCategoriesUrl = "https://dreamydelight-7ba4e-default-rtdb.firebaseio.com/menu-categories.json";   //json string of data
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsUrl = "https://dreamydelight-7ba4e-default-rtdb.firebaseio.com/menu/";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html"


    //for convinience method to add html --> helps in reusability
    var insertHtml = function (selector, html) {
        var targetElement = document.querySelector(selector);
        targetElement.innerHTML = html;
    }


    //show loading icon - until the fetching time
    var showLoading = function (selector) {
        var html = "<div class='text-center>";
        html += "<img src='/images/ajax-loader.gif'></div>";
        insertHtml(selector,html);
    }


    //return substitute of '{{propName}}'
    //with propValue -> 'string'
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);        //substitute in all places
        return string;
    }


    var switchMenuToActive = function () {
        // Remove 'active' from home button
        var classes = document.querySelector("#navHomeButton").className;
        classes = classes.replace(new RegExp("active", "g"), "");
        document.querySelector("#navHomeButton").className = classes;
    
        // Add 'active' to menu button if not already there
        classes = document.querySelector("#navMenuButton").className;
        if (classes.indexOf("active") == -1) {
          classes += " active";
          document.querySelector("#navMenuButton").className = classes;
        }
      };


      
    //on page load (before images or css is loaded)
    document.addEventListener("DOMContentLoaded", function(event) {

        //on 1st load show home page/view
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest (
            allCategoriesUrl, buildAndShowHomeHTML,
            true);
    });


    function buildAndShowHomeHTML (categories) {
        $ajaxUtils.sendGetRequest(
          homeHtmlUrl,
          function (homeHtml) {
            var chosenCategoryShortName = chooseRandomCategory(categories);
            var ShortName = chosenCategoryShortName.short_name;
            var homeHtmlToInsertIntoMainPage = insertProperty( homeHtml, "randomCategoryShortName", ShortName );
            insertHtml( "#main-content", homeHtmlToInsertIntoMainPage );
          },
          false); 
    }

    function chooseRandomCategory (categories) 
    {
        var randomArrayIndex = Math.floor(Math.random() * categories.length);
        return categories[randomArrayIndex];
    }

    //load the menu categories
    dd.loadMenuCategories = function () {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHtml);
    }


    //load the menu items view --> with short name for each category
    dd.loadMenuItems = function (categoryShort) {
        showLoading("#main-content");
        console.log("Requesting URL:", menuItemsUrl + categoryShort + '.json');
        $ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort + '.json', buildAndShowMenuItemHtml);
    } 


    //builds html for categories page based on data from server
    function buildAndShowCategoriesHtml (categories) {

        //load title snippet
        $ajaxUtils.sendGetRequest (
            categoriesTitleHtml,
            function (categoriesTitleHtml) {

                //retrieve single category snippet
                $ajaxUtils.sendGetRequest (
                    categoryHtml,
                    function (categoryHtml) {
    
                        // Switch CSS class active to menu button
                        switchMenuToActive();

                        var categoriesViewHtml = buildCategoriesViewHtml (categories, categoriesTitleHtml, categoryHtml);
                        insertHtml("#main-content", categoriesViewHtml);
                    },
                    false);
            },
        false);
    }



    //builds html for categories -> menu-items page based on data from server
    function buildAndShowMenuItemHtml (categoryMenuItems) {

        console.log("buildAndShowMenuItemHtml called with:", categoryMenuItems); 

        //load title snippet
        $ajaxUtils.sendGetRequest (
            menuItemsTitleHtml,
            function (menuItemsTitleHtml) {

                //retrieve single category snippet
                $ajaxUtils.sendGetRequest (
                    menuItemHtml,
                    function (menuItemsHtml) {
                            
                        // Switch CSS class active to menu button
                        switchMenuToActive();
                        
                        var menuItemsViewHtml = buildmenuItemsViewHtml (categoryMenuItems, menuItemsTitleHtml, menuItemsHtml);
                        insertHtml("#main-content", menuItemsViewHtml);
                    },
                    false);
            },
        false);
    }


    //using categories data and snippets html, build categories view html to be inserted into page
    function buildCategoriesViewHtml (categories, categoriesTitleHtml, categoryHtml) {
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

        //loop over categories
        for(var i=0; i < categories.length; i++) {
            var html = categoryHtml;                          //copy by value
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;

            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);

            finalHtml += html;
        }
        finalHtml += "</section>";
        return finalHtml;
    }


        //using categories --> menu-items data and snippets html, build categories view html to be inserted into page
        function buildmenuItemsViewHtml (categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
            
            console.log("categoryMenuItems:", categoryMenuItems);   // Check what data is being passed

            console.log("category:", categoryMenuItems.category);
            console.log("menuitems:", categoryMenuItems.menu_items);
            console.log("menuitems_len :", (categoryMenuItems.menu_items).length);

            menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
            menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);
            
            var finalHtml = menuItemsTitleHtml;
            finalHtml += "<section class='row'>";
    

            //loop over menu-items
            var menuItems = categoryMenuItems.menu_items;
            var catShortName = categoryMenuItems.category.short_name;


            for(var i=0; i < menuItems.length; i++) {
                
                var html = menuItemHtml;                          //copy by value    
                html = insertProperty(html, "short_name", menuItems[i].short_name);
                html = insertProperty(html, "catShortName", catShortName);
                html = insertItemPrice(html, "price", menuItems[i].price);
                html = insertProperty(html, "name", menuItems[i].name);
                html = insertProperty(html, "description", menuItems[i].description);

                if (i % 2 != 0){
                    html += "<div class='clearfix visible-lg-block visible-md-block'></div>"
                }

                finalHtml += html;
            }
            finalHtml += "</section>";
            return finalHtml;
        }


        function insertItemPrice (html, pricePropName, priceValue) {
            if (!priceValue){
                return insertProperty(html, pricePropName, priceValue);
            }
            priceValue = "$" + priceValue.toFixed(2);
            html = insertProperty(html, pricePropName, priceValue);
            return html;
        }



    window.$dd = dd;

}) (window);

