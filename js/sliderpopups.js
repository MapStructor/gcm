//Default slider position
$(
  "#infoLayerGrantLots, #infoLayerCurrLots, #infoLayerDutchGrants, #demoLayerInfo, #infoLayerCastello, #infoLayerNativeGroups"
).slideUp();

const extractTextFromHTML = (htmlString) => $("<div>").html(htmlString).text();

const addFieldToPopup = (
  fieldContent,
  displayMode = "",
  addExtraBreak = "",
  defaultValue = ""
) => {
  let content = fieldContent
    ? displayMode === "unlinked"
      ? extractTextFromHTML(fieldContent)
      : fieldContent
    : defaultValue;
  return content
    ? (addExtraBreak === "break" ? "<br>" : "") + content + "<br>"
    : "";
};

const buildPopUpInfo = (props, sliderPopupName, type) => {
    console.log(props);
	
    let popup_html = "";

            switch (type) {
			    case 'germany':
				    popup_html = `<h3>Germany</h3>`;
			        break;
				case 'global':
				    popup_html = `<h3>Boundary</h3>`;
			        break;
				case 'labels':
				    popup_html = `<h3>Labels</h3>`;
			        break;
				default:
				    popup_html = `<h3>Boundary</h3>`;
					return;
	        }
			
        popup_html += `<hr><br><b>${props.label}</b> <br><br><b>Border Changes:</b><br><b>Previous:</b> <i>${props.start2}</i><br><b>Next:</b> <i>${props.end2}</i><br><br>`;

    $(sliderPopupName).html(popup_html);
	
	//$("#infoLayerDutchGrants").html(popup_html);
  
};
