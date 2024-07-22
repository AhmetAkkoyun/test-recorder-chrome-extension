# Test Scenario Recorder 


## İçindekiler
1. [Giriş](#giriş)
2. [Özellikler](#özellikler)
3. [Kurulum](#kurulum)
4. [Kullanım Kılavuzu](#kullanım-kılavuzu)
5. [Teknik Detaylar](#teknik-detaylar)
   * [Özet Kod Yapısı ve İşlevler](#özet-kod-yapısı-ve-işlevler)
   * [Detaylı Kod Açıklamaları](#detaylı-kod-açıklamaları)
6. [API Dokümantasyonu](#api-dokümantasyonu)
7. [Sorun Giderme](#sorun-giderme)
8. [Sürüm Geçmişi](#sürüm-geçmişi)
9. [İletişim / Destek](#iletişim--destek)


## Giriş

Test Scenario Recorder, web uygulamalarında kullanıcı etkileşimlerini otomatik olarak kaydeden güçlü bir Chrome eklentisidir. Bu araç, test senaryolarının hızlı ve kolay bir şekilde oluşturulmasını sağlayarak, yazılım test süreçlerini önemli ölçüde hızlandırır ve basitleştirir.

Eklentimiz, QA uzmanlarının, geliştiricilerin ve test otomasyonu mühendislerinin günlük iş akışlarını iyileştirmek için tasarlanmıştır. Kullanıcı etkileşimlerini gerçek zamanlı olarak yakalayarak, manuel olarak test senaryoları yazma ihtiyacını ortadan kaldırır ve insan hatası riskini azaltır.

Test Scenario Recorder ile:
- Karmaşık kullanıcı eylemlerini kolayca kaydedebilirsiniz.
- Regresyon testleri için tekrarlanabilir senaryolar oluşturabilirsiniz
- Test süreçlerinizi otomatikleştirerek zaman ve kaynak tasarrufu sağlayabilirsiniz

Eklentimiz, modern web uygulamalarının test gereksinimlerini karşılamak için sürekli olarak geliştirilmekte ve güncellenmektedir. Kullanıcı geri bildirimleri ve sektör trendleri doğrultusunda yeni özellikler eklemeye devam ediyoruz.

Test Scenario Recorder'ı kullanarak, test süreçlerinizi daha verimli hale getirin ve yazılım kalitenizi artırın.


## Özellikler

- Tıklama olaylarını otomatik kaydetme
- Giriş alanlarındaki değişiklikleri izleme ve kaydetme
- Kayıt işlemlerini başlatma, duraklatma, devam ettirme ve durdurma
- Kaydedilen senaryoları belirtilen sunucuya otomatik gönderme
- Her etkileşim için benzersiz CSS veya XPath seçicileri oluşturma

## Kurulum

### Geliştirici modu için yerel kurulum:
1. Javascript dosyalarında gerekli olan sunucu ayarlarını yapın.
2. Chrome'da `chrome://extensions` adresine gidin.
3. Geliştirici modunu açın.
4. "Paketlenmemiş öğe yükle" seçeneği ile eklenti klasörünü seçin.

### Sunucu üzerinden çalıştırmak için kurulum
1. Javascript dosyalarında gerekli olan sunucu ayarlarını yapın.
2. Chrome'da `chrome://extensions` adresine gidin.
3. Geliştirici modunu açın.
4. "Uzantı Paketle" seçeneği ile eklenti klasörünü seçin.
5. Elde ettiğiniz crx uzantılı dosyayı sunucunun okuyabileceği bir dosya yoluna taşıyın.

## Kullanım Kılavuzu

1. Chrome'da eklenti ikonuna tıklayarak paneli açın.
2. Test edilecek web sayfasına gidin.
3. "Başlat" düğmesine tıklayarak kaydı başlatın.
4. Sayfada normal şekilde gezinin ve etkileşimde bulunun.
5. Gerektiğinde "Duraklat" veya "Devam Et" düğmelerini kullanın.
6. "Durdur" düğmesine tıklayarak kaydı sonlandırın.

## Teknik Detaylar

### Dosya Yapısı

- `manifest.json`: Eklenti konfigürasyonu
- `content.js`: Ana işlevsellik
- `ui.js`: Kullanıcı arayüzü işlemleri
- `recorder.js`: Kayıt işlemleri
- `selector.js`: Seçici oluşturma işlemleri
- `api.js`: Sunucu iletişimi

## Özet Kod Yapısı ve İşlevler

### manifest.json

Bu dosya, eklentinin temel yapılandırmasını içerir. Manifest V3 kullanılmaktadır.

Önemli alanlar:
- `permissions`: Eklentinin ihtiyaç duyduğu izinler
- `content_scripts`: Hangi sayfaları etkileyeceği ve kullanılacak script dosyaları
- `action`: Eklenti ikonu ve davranışı

### content.js

Ana koordinasyon ve başlatma işlevlerini içerir.

Önemli fonksiyonlar:
- `window.addEventListener('load', function() {...})`: Sayfa yüklendiğinde eklentiyi başlatır.
- `chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {...})`: Chrome mesajlarını dinler ve panel görünürlüğünü kontrol eder.

### ui.js

Kullanıcı arayüzü ile ilgili işlevleri içerir.

Önemli fonksiyonlar:
- `createPanel()`: Eklenti panelini oluşturur.
- `showButtons(...buttonsToShow)`: Belirtilen butonları gösterir, diğerlerini gizler.

### recorder.js

Kayıt işlemlerinin mantığını ve kullanıcı etkileşimlerini yakalamayı içerir.

Önemli fonksiyonlar:
- `startRecording()`: Kayıt işlemini başlatır.
- `pauseRecording()`: Kaydı duraklatır.
- `continueRecording()`: Duraklatılmış kaydı devam ettirir.
- `stopRecording()`: Kaydı durdurur ve sunucuya gönderir.
- `addAction(action)`: Yeni bir eylemi kayıt listesine ekler.

Olay dinleyicileri:
- `document.addEventListener('click', function(e) {...})`: Tıklama olaylarını yakalar.
- `document.addEventListener('input', function(e) {...})`: Giriş alanı değişikliklerini yakalar.

### selector.js

Etkileşime giren elementler için benzersiz seçiciler oluşturur.

Önemli fonksiyon:
- `getUniqueSelector(element)`: Verilen element için benzersiz bir CSS ID veya XPath seçici oluşturur.

### api.js

Sunucu ile iletişim kurmakla ilgili işlevleri içerir.

Önemli fonksiyon:
- `sendActionsToServer(actions)`: Kaydedilen eylemleri belirtilen sunucu adresine gönderir.


## Detaylı Kod Açıklamaları

### manifest.json

```json
  "manifest_version": 3,
  "name": "Test Scenario Recorder",
  "version": "1.0",
  "description": "Records user interactions for test automation",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
```
Bu bölüm, eklentinin temel bilgilerini tanımlar:
- `manifest_version`: Chrome eklentileri için güncel manifest sürümü (3).
- `name`: Eklentinin adı.
- `version`: Eklentinin sürüm numarası.
- `description`: Eklentinin kısa açıklaması.
- `icons`: Farklı boyutlarda eklenti simgeleri.


```json
"permissions": [
    "activeTab",
    "storage"
  ],
```
Eklentinin gerekli izinleri:
- `activeTab`: Kullanıcının mevcut aktif sekmesine erişim sağlar.
- `storage`: Eklentinin veri depolamasına izin verir.


```json
 "host_permissions": [
    "http://localhost:8080/",
    "<all_urls>"
  ],
```
Eklentinin erişebileceği URL'ler:
- `http://localhost:8080/`: Yerel geliştirme sunucusu için izin.
- `<all_urls>`: Tüm web sitelerine erişim izni.


```json
"action": {
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
```
Eklenti simgesinin farklı boyutlardaki versiyonlarını tanımlar. Bu simgeler, tarayıcı arayüzünde görüntülenir.


```json
"content_scripts": [
{
"matches": ["<all_urls>"],
"css": ["content.css"],
"js": ["selector.js", "ui.js", "recorder.js", "api.js", "content.js"],
"run_at": "document_start"
}
],
```
Content script'lerin yapılandırması:
- `matches`: Hangi URL'lerde çalışacağını belirtir (`<all_urls>` tüm siteleri kapsar).
- `css`: Enjekte edilecek CSS dosyası.
- `js`: Enjekte edilecek JavaScript dosyaları.
- `run_at`: Script'lerin ne zaman çalıştırılacağını belirtir (`document_start` sayfa yüklenmeden önce).


```json
"background": {
"service_worker": "background.js"
}
```
Arka planda sürekli çalışacak script'i tanımlar. `background.js` eklentinin arka plan işlemlerini yönetir.


### content.js

```javascript
window.addEventListener('load', function() {
  if (localStorage.getItem('recording') === 'true') {
    createPanel();
    panel.style.display = 'block';
    showButtons('pauseRecording', 'stopRecording');
  }
  let newPageUrl = window.location.href;
  if (localStorage.getItem('currentUrl') !== newPageUrl) {
    localStorage.setItem('currentUrl', newPageUrl)
  }
  if (localStorage.getItem('modelId') !== null) {
    modelId = localStorage.getItem('modelId');
  }
});
```
Bu kod bloğu, sayfa tam olarak yüklendiğinde çalışır:
- Eğer kayıt devam ediyorsa (`recording === 'true'`), kontrol panelini oluşturur ve gösterir.
- Mevcut sayfa URL'sini kontrol eder ve gerekirse günceller.
- Mevcut model ID'sini kontrol eder ve varsa yükler.


```javascript
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "togglePanel") {
    if (!panel) {
      createPanel();
    }
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
});
```
Bu listener, arka plan script'inden gelen mesajları dinler:
"togglePanel" mesajı alındığında, kontrol panelini oluşturur (eğer yoksa) ve görünürlüğünü değiştirir.


### recorder.js

```javascript
let actions = [];
let currentInputGroup = null;
let modelId;
let currentUrl;
```
Global değişkenler:
- `actions`: Kaydedilen eylemleri tutan dizi.
- `currentInputGroup`: Şu anki giriş grubunu tutan değişken.
- `modelId`: Mevcut test senaryosunun benzersiz kimliği.
- `currentUrl`: Şu anki sayfanın URL'si.


```javascript
function startRecording() {
    if (!localStorage.getItem('modelId')) {
        modelId = generateUUID();
        localStorage.setItem('modelId', modelId);
        currentUrl = window.location.href;
        localStorage.setItem('currentUrl', currentUrl);
    } else {
        modelId = localStorage.getItem('modelId');
    }
    localStorage.setItem('recording', 'true');
    actions = JSON.parse(localStorage.getItem('actions') || '[]');
    currentInputGroup = null;
    console.log("Recording started");
    showButtons('pauseRecording', 'stopRecording');
}
```
`startRecording` fonksiyonu:
- Yeni bir kayıt başlatır veya mevcut kaydı devam ettirir.
- Model ID ve URL'yi kontrol eder ve gerekirse yeni oluşturur.
- Kayıt durumunu ve mevcut eylemleri local storage'dan yükler.
- Kullanıcı arayüzünü günceller.


```javascript
function pauseRecording() {
    localStorage.setItem('recording', 'false');
    console.log("Recording paused");
    showButtons('continueRecording', 'stopRecording');
}
```
`pauseRecording` fonksiyonu:
- Kaydı geçici olarak durdurur.
- Kayıt durumunu günceller ve kullanıcı arayüzünü değiştirir.


```javascript
function continueRecording() {
    localStorage.setItem('recording', 'true');
    console.log("Recording continued");
    showButtons('pauseRecording', 'stopRecording');
}
```
`continueRecording` fonksiyonu:
- Duraklatılmış kaydı devam ettirir.
- Kayıt durumunu günceller ve kullanıcı arayüzünü değiştirir.


```javascript
function stopRecording() {
    localStorage.setItem('recording', 'false');
    finalizeCurrentInputGroup();
    actions = JSON.parse(localStorage.getItem('actions') || '[]');
    console.log("Recording stopped", actions);

    if (actions.length > 0) {
        sendActionsToServer(actions);
    } else {
        console.log("No actions to send");
    }

    localStorage.removeItem('actions');
    localStorage.removeItem('modelId');
    console.log('modelId = ' + modelId);
    showButtons('startRecording');
}
```
`stopRecording` fonksiyonu:
- Kaydı sonlandırır.
- Son giriş grubunu tamamlar.
- Kaydedilen eylemleri sunucuya gönderir (eğer varsa).
- Local storage'ı temizler ve kullanıcı arayüzünü günceller.


```javascript
function finalizeCurrentInputGroup() {
    if (currentInputGroup) {
        addAction(currentInputGroup);
        currentInputGroup = null;
    }
}
```
`finalizeCurrentInputGroup` fonksiyonu:
- Mevcut giriş grubunu tamamlar ve eylemlere ekler.


```javascript
function addAction(action) {
    actions = JSON.parse(localStorage.getItem('actions') || '[]');
    actions.push(action);
    localStorage.setItem('actions', JSON.stringify(actions));
}
```
`addAction` fonksiyonu:
- Yeni bir eylemi actions dizisine ekler ve local storage'a kaydeder.


```javascript
document.addEventListener('click', function(e) {
    if (localStorage.getItem('recording') === 'true') {
        if (e.target.closest('[data-recorder-ui]')) {
            return;
        }
        finalizeCurrentInputGroup();
        const selector = getUniqueSelector(e.target);
        addAction({
            actionType: 'CLICK',
            selector: selector,
            value: "",
            event: JSON.stringify(e)
        });
    }
});
```
Tıklama olayı dinleyicisi:
- Kayıt aktifse ve tıklanan element eklenti UI'ına ait değilse çalışır.
- Tıklanan elementin benzersiz seçicisini alır ve yeni bir tıklama eylemi kaydeder.


```javascript
document.addEventListener('input', function(e) {
    if (localStorage.getItem('recording') === 'true') {
        const selector = getUniqueSelector(e.target);
        const currentValue = e.target.value;

        if (!currentInputGroup || currentInputGroup.selector.selector !== selector.selector) {
            finalizeCurrentInputGroup();
            currentInputGroup = {
                actionType: 'INPUT',
                selector: selector,
                value: currentValue,
                event: JSON.stringify(e)
            };
        } else {
            currentInputGroup.value = currentValue;
        }
    }
});
```
Giriş olayı dinleyicisi:
- Kayıt aktifse çalışır.
- Giriş yapılan elementin benzersiz seçicisini alır.
- Yeni bir giriş grubu oluşturur veya mevcut grubu günceller.


### selector.js

```javascript
function getUniqueSelector(element) {
    if (element.id) {
        return {selectorType: "ID", selector: element.id }
    }

    let path = '';
    while (element !== document.body) {
        if (!element.parentNode) {
            break;
        }

        let idx = Array.from(element.parentNode.children)
            .filter(e => e.tagName === element.tagName)
            .indexOf(element) + 1;

        idx > 1 ? (path = `/${element.tagName.toLowerCase()}[${idx}]${path}`)
            : (path = `/${element.tagName.toLowerCase()}${path}`);

        element = element.parentNode;
    }

    return {selectorType: "XPATH", selector: `/html/body${path}`};
}
```
`getUniqueSelector` fonksiyonu:
- Verilen HTML elementi için benzersiz bir seçici oluşturur.
- Önce element ID'sini kontrol eder, varsa ID seçicisi döndürür.
- ID yoksa, elementin DOM ağacındaki konumuna göre XPath oluşturur.
- Her adımda, aynı türdeki kardeş elementlerin sırasını kontrol eder.

### ui.js

```javascript
function createPanel() {
    panel = document.createElement('div');
    panel.id = 'test-recorder-panel';
    panel.setAttribute('data-recorder-ui', 'true');
    panel.style.display = 'none';
    panel.innerHTML = `
    <button id="closePanel" data-recorder-ui="true" style="float: right;">—</button>
    <button id="startRecording" data-recorder-ui="true">Başlat</button>
    <button id="pauseRecording" data-recorder-ui="true" class="hidden">Duraklat</button>
    <button id="continueRecording" data-recorder-ui="true" class="hidden">Devam Et</button>
    <button id="stopRecording" data-recorder-ui="true" class="hidden">Durdur</button>
  `;
    document.body.appendChild(panel);

    document.getElementById('closePanel').addEventListener('click', () => panel.style.display = 'none');
    document.getElementById('startRecording').addEventListener('click', startRecording);
    document.getElementById('pauseRecording').addEventListener('click', pauseRecording);
    document.getElementById('continueRecording').addEventListener('click', continueRecording);
    document.getElementById('stopRecording').addEventListener('click', stopRecording);
}
```
`createPanel` fonksiyonu:
- Eklentinin kontrol panelini oluşturur.
- Panel için gerekli HTML elementlerini oluşturur ve stilleri ayarlar.
- Paneldeki butonlara olay dinleyicileri ekler.


```javascript
function showButtons(...buttonsToShow) {
  ['startRecording', 'pauseRecording', 'continueRecording', 'stopRecording'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  buttonsToShow.forEach(id => {
    document.getElementById(id).classList.remove('hidden');
  });
}
```
`showButtons` fonksiyonu:
- Belirtilen butonları gösterir, diğerlerini gizler.
- Kayıt durumuna göre uygun butonların görünürlüğünü yönetir.


### api.js

```javascript
function sendActionsToServer(actions) {
    fetch(`http://localhost:9090/test-model/${modelId}/scenarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(actions)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => console.log('Success:', data))
        .catch((error) => {
            console.error('Error:', error);
            console.error('Error details:', error.message);
        });
}
```
`sendActionsToServer` fonksiyonu:
- Kaydedilen eylemleri belirtilen sunucu adresine gönderir.
- HTTP POST isteği yapar ve JSON formatında veri gönderir.
- Sunucu yanıtını kontrol eder ve hata durumunda uygun mesajları loglar.


### background.js

```javascript
chrome.action.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, {action: "togglePanel"});
});
```
Arka plan script'i:
- Eklenti simgesine tıklandığında çalışır.
- Aktif sekmeye "togglePanel" mesajı gönderir.



### content.css

```css
#test-recorder-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 250px;
    background-color: rgba(192, 192, 192, 0.8);
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    z-index: 10000;
    font-family: Arial, sans-serif;
}
```
Bu CSS kuralı, test kaydedici panelinin genel görünümünü ve konumunu belirler:
- `position: fixed;`: Panel, sayfa kaydırılsa bile ekranda sabit kalır.
- `top: 20px; right: 20px;`: Paneli sayfanın sağ üst köşesine yerleştirir.
- `width: 250px;`: Panelin genişliğini belirler.
- `background-color: rgba(192, 192, 192, 0.8);`: Yarı saydam gri arka plan rengi.
- `border-radius: 15px;`: Köşeleri yuvarlatır.
- `box-shadow`: Panele hafif bir gölge efekti ekler.
- `z-index: 10000;`: Panelin diğer sayfa öğelerinin üzerinde görünmesini sağlar.


```css
#test-recorder-panel button {
    width: 100%;
    margin-bottom: 10px;
    padding: 12px;
    border: none;
    border-radius: 25px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```
Bu kural, panel içindeki tüm butonların stilini belirler:
- `width: 100%;`: Butonları panel genişliğinde yapar.
- `margin-bottom: 10px;`: Butonlar arasında boşluk bırakır.
- `border: none; border-radius: 25px;`: Kenarlıkları kaldırır ve köşeleri yuvarlatır.
- `cursor: pointer;`: Fare imleci üzerine geldiğinde el işaretine dönüşür.
- `transition`: Buton durumları arasında yumuşak geçiş sağlar.


```css
#test-recorder-panel #closePanel {
    width: 12%;
    padding: 1px;
    font-size: 10px;
    border-radius: 6px;
}
```
Paneli kapatma(gizleme) butonu için özel stil:
- Diğer butonlardan daha küçük ve farklı şekilde stillendirilmiştir.


```css
#test-recorder-panel #startRecording {
    background-color: #4CAF50;
    color: white;
}
```
"Başlat" butonu için yeşil arka plan rengi belirler.


```css
#test-recorder-panel #pauseRecording,
#test-recorder-panel #continueRecording {
    background-color: #FFA500;
    color: white;
}
```
"Duraklat" ve "Devam Et" butonları için turuncu arka plan rengi belirler.


```css
#test-recorder-panel #stopRecording {
    background-color: #f44336;
    color: white;
}
```
"Durdur" butonu için kırmızı arka plan rengi belirler.


```css
#test-recorder-panel button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
```
Butonların üzerine gelindiğinde uygulanacak efektler:
- Butonu hafifçe yukarı kaldırır ve gölgesini artırır.


```css
#test-recorder-panel button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```
Butonlara tıklandığında uygulanacak efektler:
- Butonu normal konumuna döndürür ve gölgesini azaltır.


```css
.hidden {
    display: none;
}
```
Bu sınıf, elementleri gizlemek için kullanılır. Özellikle butonların duruma göre gizlenmesi/gösterilmesi için kullanılır.

## Veri Yapısı

Kaydedilen eylemler şu formatta saklanır:

```javascript
{
  actionType: string, // 'CLICK' veya 'INPUT'
  selector: {
    selectorType: string, // 'ID' veya 'XPATH'
    selector: string // Seçicinin kendisi
  },
  value: string, // Giriş alanları için değer
  event: string // JSON formatında olay detayları
}
```
### Eklenti Akışı

Kullanıcı eklenti ikonuna tıklar.
createPanel() fonksiyonu çağrılır ve kullanıcı arayüzü oluşturulur.
Kullanıcı "Başlat" düğmesine tıklar, startRecording() çağrılır.
Kullanıcı etkileşimleri click ve input olay dinleyicileri tarafından yakalanır.
Her etkileşim için getUniqueSelector() ile benzersiz bir seçici oluşturulur.
Etkileşimler addAction() ile kayıt listesine eklenir.
Kullanıcı "Durdur" düğmesine tıkladığında, stopRecording() çağrılır.
Kaydedilen eylemler sendActionsToServer() ile sunucuya gönderilir.

## API Dokümantasyonu

Sunucu API'si:
- Endpoint: `http://localhost:9090/test-model/{modelId}/scenarios`
- Metod: POST
- Veri formatı: JSON
- Örnek veri yapısı:
  ```json
  [
    {
      "actionType": "CLICK",
      "selector": {"selectorType": "XPATH", "selector": "/html/body/div[1]/button"},
      "value": "",
      "event": "{\"type\":\"click\",\"target\":\"button\"}"
    }
  ]


## Sorun Giderme

Eklenti çalışmıyorsa: Chrome'u yeniden başlatın.
Kayıt başlamıyorsa: Sayfayı yenileyin.
Sunucu hatası alıyorsanız: Bağlantı ayarlarını kontrol edin.


## Sürüm Geçmişi

v1.0.0 (2024-07-19): İlk sürüm

Temel kayıt özellikleri,
Sunucu entegrasyonu


## İletişim / Destek
BilgeAdam Mimari ve İnovasyon Direktörlüğü - Test Otomasyon Projesi Geliştirme Takımı

