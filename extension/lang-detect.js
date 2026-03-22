/**
 * Detects the language of a tweet text.
 * Supports 35 languages via script-based and keyword-based heuristics.
 * Unsupported / ambiguous text falls back to "en".
 */
(function (global) {
  function detectTweetLang(text) {
    const t = (text || "").trim();
    if (!t) return "en";

    // ── 1. Non-Latin script detection (high confidence) ──

    if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(t)) return "ko";
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(t)) return "ja";
    if (/[\u4E00-\u9FFF]/.test(t)) return "zh";
    if (/[\u0E00-\u0E7F]/.test(t)) return "th";
    if (/[\u0900-\u097F]/.test(t)) return "hi";
    if (/[\u0980-\u09FF]/.test(t)) return "bn";
    if (/[\u0B80-\u0BFF]/.test(t)) return "ta";
    if (/[\u0C00-\u0C7F]/.test(t)) return "te";
    if (/[\u0C80-\u0CFF]/.test(t)) return "kn";
    if (/[\u0D00-\u0D7F]/.test(t)) return "ml";
    if (/[\u0A80-\u0AFF]/.test(t)) return "gu";
    if (/[\u0600-\u06FF]/.test(t)) return "ar";
    if (/[\u0590-\u05FF]/.test(t)) return "he";
    if (/[\u0370-\u03FF]/.test(t)) return "el";

    // Cyrillic: distinguish Ukrainian, Serbian, Russian
    if (/[\u0400-\u04FF]/.test(t)) {
      if (/[іїєґІЇЄҐ]/.test(t)) return "uk";
      if (/[ђљњћџЂЉЊЋЏ]/.test(t)) return "sr";
      return "ru";
    }

    // ── 2. Latin script: distinctive diacritics (high confidence) ──

    if (/[ăắằẳẵặấầẩẫậđêếềểễệốồổỗộớờởỡợứừửữựỳỹỷỵ]/i.test(t)) return "vi";
    if (/[ğşıİĞŞ]/.test(t)) return "tr";
    if (/[ąćęłńśźżĄĆĘŁŃŚŹŻ]/.test(t)) return "pl";
    if (/[ěřůďťňĚŘŮĎŤŇ]/.test(t)) return "cs";
    if (/[ășțĂȘȚ]/.test(t)) return "ro";
    if (/[őűŐŰ]/.test(t)) return "hu";

    // ── 3. Latin script: keyword-based detection ──

    const lo = t.toLowerCase();

    // Turkish
    if (/\b(ve|bir|için|bu|ile|gibi|çok|var|yok|nasıl|neden|değil|olarak|çünkü|şimdi|böyle|tüm|sonra|önce|oldu|kendi|veya|göre)\b/.test(lo))
      return "tr";

    // French
    if (/\b(est|dans|pas|pour|avec|vous|nous|être|été|cette|très|aussi|comme|mais|donc|alors|merci|bonjour|tout|leur|dont|où|je|tu|il|elle|nous|ces|ses|mes|tes)\b/.test(lo))
      return "fr";

    // German
    if (/ß/.test(t) || /\b(und|ist|nicht|ich|wir|aber|auch|noch|nur|wenn|oder|wie|bei|nach|über|unter|können|werden|haben|schon|immer|sehr|mehr|müssen|viel|dieser|keine|einem|einen)\b/.test(lo))
      return "de";

    // Spanish
    if (/[ñ¡¿]/.test(t) || /\b(pero|como|para|por|con|sin|sobre|más|también|muy|puede|todo|esta|este|esto|hay|fue|ser|tiene|hace|cada|otro|otra|nosotros|ellos|usted)\b/.test(lo))
      return "es";

    // Portuguese
    if (/[ãõ]/i.test(t) || /\b(não|uma|para|com|como|mais|por|mas|foi|são|tem|você|muito|também|pode|isso|depois|antes|quando|onde|porque|ainda|tudo|nós|eles|ela)\b/.test(lo))
      return "pt";

    // Italian
    if (/\b(della|delle|dello|degli|nel|nella|nelle|nello|negli|che|per|non|sono|anche|più|questo|questa|quello|quella|molto|tutto|tutti|sempre|ancora|perché|quando|dove|bene|fare|avere|essere|fatto|stato)\b/.test(lo))
      return "it";

    // Dutch
    if (/\b(het|een|van|voor|met|niet|als|dat|wat|maar|wel|ook|nog|bij|naar|uit|tot|hier|daar|deze|geen|kan|wordt|zijn|worden|meer|door|alle|veel|waar|wanneer|omdat)\b/.test(lo))
      return "nl";

    // Swedish (distinctive: och, inte, att)
    if (/\b(och|inte|att)\b/.test(lo) && /\b(det|som|för|med|den|har|till|kan|ska|alla|här|mycket|efter|bara|också|utan|mellan|andra|skulle|kunde|finns)\b/.test(lo))
      return "sv";

    // Norwegian (distinctive: og + ikke + Norwegian-specific)
    if (/\b(og|ikke)\b/.test(lo) && /\b(det|som|for|med|den|har|til|kan|skal|fra|eller|men|alle|her|etter|bare|også|uten|mellom|mye|gjennom|finnes|noe|noen)\b/.test(lo))
      return "no";

    // Danish (distinctive: og + ikke + Danish-specific)
    if (/\b(og|ikke)\b/.test(lo) && /\b(det|som|for|med|den|har|til|kan|skal|fra|eller|men|alle|her|efter|bare|også|uden|mellem|meget|igennem|findes|noget|nogen)\b/.test(lo))
      return "da";

    // Finnish
    if (/\b(ja|ei|ole|olen|olet|hän|tämä|mutta|tai|niin|kun|kuin|koska|vielä|myös|vain|hyvin|paljon|sitten|ennen|jälkeen|kanssa|ilman|miksi|missä|milloin|miten)\b/.test(lo))
      return "fi";

    // Indonesian
    if (/\b(dan|yang|ini|itu|dengan|untuk|dari|tidak|ada|akan|pada|juga|sudah|bisa|oleh|atau|saya|mereka|kami|kita|anda|sangat|banyak|harus|dapat|telah|belum|masih|karena|tetapi|namun|selalu|semua)\b/.test(lo))
      return "id";

    return "en";
  }

  global.XFlowDetectLang = detectTweetLang;
})(typeof self !== "undefined" ? self : this);
