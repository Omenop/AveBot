import config from "#root/Settings/Config.js";
import { I18n } from "i18n";
import  { join } from "path"
import AveLog from "./Logs.js";
const Logger = new AveLog();

class AveLangs {
  /**
   * 
   * @param {string} lang 
   */
  constructor(lang) {
    this.languages = new I18n();
    this.languages.configure({
      locales: ['en', 'es'],
      directory: join("./src/Languages"),
      defaultLocale: config.LANG,
      retryInDefaultLocale: true,
      objectNotation: true,
      register: global,
      fallbacks: { 
        'en-*': 'en',
        'es-*': 'es'
      },
  
      logWarnFn: function (msg) {
        Logger.warn('LangWarn' + msg)
      },
  
      logErrorFn: function (msg) {
        Logger.error('LangError',  msg)          
      },
  
      missingKeyFn: (locale, value) => { // nos avisa cuando nos flto traducir algo
        throw new Error(`Missing translation for "${value}" in "${locale}"`)
        return value ?? '_'
    },
  
      mustacheConfig: {
          tags: ["{{", "}}"],
          disable: false
      }
  });
    this.lang = lang;
  }
  /**
   * 
   * @param {string} key - Path of the text in the json
   * @param {Record<string, any>=} variables - Variables to replace
   * @returns {string}
   */
   l(key, variables) {
     let translation;
     if (variables) {
       translation = this.languages.__mf({ phrase: key, locale: this.lang ?? "en"}, variables);
     } else {
       translation = this.languages.__({ phrase: key, locale: this.lang ?? "en"});
     }
 
     if (!translation || translation === key) {
       throw new Error(`The key '${key}' does not exist in the language file.`);
     }
 
     if (variables) {
       const variableNames = Object.keys(variables);
       const missingVariables = variableNames.filter(variableName => translation.includes(`{${variableName}}`));
 
       if (missingVariables.length > 0) {
         throw new Error(`Missing values for variables '${missingVariables.join(", ")}' in the translation string '${translation}'.`);
       }     
     }
 
     return translation;
   }
}

export default AveLangs;