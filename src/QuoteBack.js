var quoteStyle = `.quoteback-container {
    --background-color: white;
    --border-color-normal: #C2DFE3;
    --border-color-hover: #9DB8BF;
    --author-color: black;
    --title-color: #5C6D73;
    --gototext-color: #9DB8BF;
    --content-color: #464A4D;
    --internal-blockquote-color: #5C6D73;
}
@media (prefers-color-scheme: dark) {
    .quoteback-container {
    --background-color: #161717;
    --border-color-normal: #253237;
    --border-color-hover: #5C6D73;
    --author-color: #E0FBFC;
    --title-color: #9DB8BF;
    --gototext-color: #5C6D73;
    --content-color: #9DB8BF;
    --internal-blockquote-color: #5C6D73;
}
}
.quoteback-container{font-family:-apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";text-rendering:optimizeLegibility;border:1px solid var(--border-color-normal);border-radius:8px;margin-bottom:25px;max-width:800px;background-color:var(--background-color);text-align:left;-webkit-transition:all 0.2s ease;-moz-transition:all 0.2s ease;-ms-transition:all 0.2s ease;-o-transition:all 0.2s ease;transition:all 0.2s ease}.quoteback-container:hover{transform:translateY(-3px);box-shadow:0px 6px 20px 0px rgba(0,0,0,0.15);border:1px solid var(--border-color-hover)}.quoteback-container .quoteback-parent{overflow:hidden;position:relative;width:100%;box-sizing:border-box}.quoteback-container .quoteback-parent .quoteback-content{font-family:-apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";font-size:16px;font-weight:400;padding:15px;color:var(--content-color);line-height:150%}.quoteback-container .quoteback-head{border-top:1px solid var(--border-color-normal);display:flex;flex-flow:row nowrap;justify-content:start;align-items:stretch;padding-left:15px;-webkit-transition:all 0.2s ease;-moz-transition:all 0.2s ease;-ms-transition:all 0.2s ease;-o-transition:all 0.2s ease;transition:all 0.2s ease}.quoteback-container .quoteback-head .quoteback-avatar{border-radius:100%;border:1px solid var(--border-color-normal);width:42px;height:42px;min-width:42px !important;margin:12px 0px;position:relative}.quoteback-container .quoteback-head .quoteback-avatar .mini-favicon{width:22px;height:22px;position:absolute;margin:auto;top:0;left:0;right:0;bottom:0}.quoteback-container .quoteback-head .quoteback-metadata{min-width:0px;display:flex;flex-shrink:1;align-items:center;margin-left:10px}.quoteback-container .quoteback-head .metadata-inner{font-size:14px;line-height:1.2;width:100%;max-width:525px}@media (max-width: 414px){.quoteback-container .quoteback-head .metadata-inner{max-width:200px}}.quoteback-container .quoteback-head .metadata-inner .quoteback-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600;padding-right:20px;color:var(--title-color)}.quoteback-container .quoteback-head .metadata-inner .quoteback-author{font-size:14px;line-height:1.2;color:var(--author-color);font-weight:600;margin-bottom:2px}.quoteback-container .quoteback-head .quoteback-backlink{margin-left:auto;display:flex;flex-shrink:1;align-items:center;width:81px;min-width:81px !important;padding:0px 15px !important;border-left:1px solid var(--border-color-normal)}.quoteback-container .quoteback-head .quoteback-backlink .quoteback-arrow{border:none !important;font-family:inherit !important;font-size:14px !important;color:var(--gototext-color) !important;text-decoration:none !important;-webkit-transition:opacity 0.1s ease;-moz-transition:opacity 0.1s ease;-ms-transition:opacity 0.1s ease;-o-transition:opacity 0.1s ease;transition:opacity 0.1s ease}.quoteback-container .quoteback-head .quoteback-backlink .quoteback-arrow:hover{opacity:.5 !important}.quoteback-container .quoteback-head .quoteback-backlink .quoteback-arrow:visited{text-decoration:none !important}.editable:focus{outline:none}.quoteback-content a{color:var(--content-color);-webkit-transition:opacity 0.2s ease;-moz-transition:opacity 0.2s ease;-ms-transition:opacity 0.2s ease;-o-transition:opacity 0.2s ease;transition:opacity 0.2s ease}.quoteback-content a:hover{opacity:.5}.quoteback-content p{margin-block-start:0px;margin-block-end:.5em}.quoteback-content p:last-of-type{margin-block-end:0px}.quoteback-content img{width:100%;height:auto;margin:.5em 0em}.quoteback-content blockquote{border-left:2px solid var(--border-color-normal);padding-left:.75em;margin-inline-start:1em;color:var(--internal-blockquote-color)}.quoteback-content ol,.quoteback-content ul{margin-block-start:.5em;margin-block-end:.5em}.quoteback-content h1,.quoteback-content h2,.quoteback-content h3{margin-block-start:.5em;margin-block-end:.5em}`;

var template = document.createElement("template");
template.innerHTML = `
<style>${quoteStyle}</style>
      <div class="quoteback-container" role="quotation" aria-labelledby="quoteback-author" tabindex="0">
          <div id="quoteback-parent" class="quoteback-parent">
              <div class="quoteback-content"></div>       
          </div>

          <div class="quoteback-head">       
              <div class="quoteback-avatar"><img class="mini-favicon" src=""/></div>     
              <div class="quoteback-metadata">
                  <div class="metadata-inner">
                      <div aria-label="" id="quoteback-author" class="quoteback-author"></div>
                      <div aria-label="" class="quoteback-title"></div>
                  </div>  
              </div>

          <div class="quoteback-backlink"><a target="_blank" aria-label="go to the full text of this quotation" rel="noopener" href="" class="quoteback-arrow">Go to text <span class="right-arrow">&#8594;</span></a></div>
          </div>  
      </div>`;

class QuoteBack extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.text = decodeURIComponent(this.getAttribute("text"));
    this.author = this.getAttribute("author");
    this.title = this.getAttribute("title");
    this.url = this.getAttribute("url");
    this.favicon = this.getAttribute("favicon");
    this.editable = this.getAttribute("editable");
    this.darkmode = this.getAttribute("darkmode");
  }

  connectedCallback() {
    console.info("connected");

    if (this.darkmode == "true") {
      this.shadowRoot.querySelector(".quoteback-container").classList +=
        " dark-theme";
    }
    this.shadowRoot.querySelector(".quoteback-content").innerHTML =
      decodeURIComponent(this.getAttribute("text"));
    this.shadowRoot.querySelector(".mini-favicon").src =
      this.getAttribute("favicon");
    this.shadowRoot.querySelector(".quoteback-author").innerHTML =
      this.getAttribute("author");
    this.shadowRoot
      .querySelector(".quoteback-author")
      .setAttribute("aria-label", "quote by " + this.getAttribute("author"));
    this.shadowRoot.querySelector(".quoteback-title").innerHTML =
      decodeURIComponent(this.getAttribute("title"));
    this.shadowRoot
      .querySelector(".quoteback-title")
      .setAttribute(
        "aria-label",
        "title: " + decodeURIComponent(this.getAttribute("title"))
      );
    this.shadowRoot.querySelector(".quoteback-arrow").href =
      this.getAttribute("url");

    // Manually focus and blur clicked targets
    // This solves firefox bug where clicking between contenteditable fields doesn't work
    if (this.editable == "true") {
      let titlediv = this.shadowRoot.querySelector(".quoteback-title");
      let authordiv = this.shadowRoot.querySelector(".quoteback-author");

      titlediv.addEventListener("click", (evt) => {
        evt.target.contentEditable = true;
        evt.target.focus();
      });
      titlediv.addEventListener("blur", (evt) => {
        evt.target.contentEditable = false;
      });

      authordiv.addEventListener("click", (evt) => {
        evt.target.contentEditable = true;
        evt.target.focus();
      });
      authordiv.addEventListener("blur", (evt) => {
        evt.target.contentEditable = false;
      });
    }
    // end this fix
  }
}

export default QuoteBack;
