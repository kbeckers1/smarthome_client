import { html, TemplateResult } from 'lit';

export function cell_bool(value: boolean): TemplateResult {
    return html`
        <style>
            .base {
                height: 100%;
                width: 100%;
                align-content: center;
                justify-content: center;
                text-align: center;
                border-radius: 10px;
                color: white;
            }
            .true {
                background-color: #007604;
            }
            .false {
                background-color: #c30000;
            }
        </style>
        <div class="base ${value}">
            <span>${value === true ? 'Ja' : 'Nee'}</span>
        </div>
      `;
}