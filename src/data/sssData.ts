

export type Category = 'Genel' | 'Ürünler' | 'Kargo';

export type Question = {
  id: string;
  category: Category;
  question: string;
  answer: string;
};


export const sssData: Question[] = [
  // --- Genel
  {
    id: 'genel-1',
    category: 'Genel',
    question: 'OJS Nutrition ürünlerinin menşei neresi?',
    answer:
      'OJS Nutrition ürünleri Almanya menşeilidir. Üretim ve kalite süreçlerimiz üretici tesislerin belirlediği standartlara göre yürütülmektedir.',
  },
  {
    id: 'genel-2',
    category: 'Genel',
    question: 'Hangi sertifikalarınız var?',
    answer:
      'Üretim süreçlerimiz genel olarak kalite ve hijyen standartlarına uygun şekilde yürütülür. Ürün üzerinde/ambalajda görünen spesifik sertifika bilgileri için ilgili ürünün detay sayfasını veya ambalajını kontrol edebilirsiniz. Detaylı belge talebi için müşteri hizmetleriyle iletişime geçebilirsiniz.',
  },
  {
    id: 'genel-3',
    category: 'Genel',
    question: 'Satılan ürünler garantili midir? Değişim var mı?',
    answer:
      'Ürünlerimiz üretim hatalarına karşı garantilidir. Teslimde paket hasarlı veya eksikse kargo görevlisine tutanak tutturup bize bildirin; uygun görülürse değişim veya iade süreci başlatılır. İade koşulları ve süreci için iade politikamıza bakabilirsiniz.',
  },
  {
    id: 'genel-4',
    category: 'Genel',
    question: 'Sipariş verirken sorun yaşıyorum, ne yapmam gerekir?',
    answer:
      'Sipariş sırasında hata alıyorsanız önce internet bağlantınızı ve kart bilgilerinizi kontrol edin. Sorun devam ediyorsa “Bize Ulaşın” sayfasındaki iletişim kanallarından (e-posta/telefon) veya hesabınızdaki sipariş detayından destek talebi oluşturun; mümkünse hata mesajı ve ekran görüntüsü ekleyin.',
  },
  {
    id: 'genel-5',
    category: 'Genel',
    question: 'OJS Nutrition ürünleri nerede satılıyor?',
    answer:
      'Ürünlerimizi resmi web sitemiz üzerinden ve yetkili satış kanallarımızda bulabilirsiniz. Yetkili satıcı listesi ve güncel satış noktaları için web sitemizdeki “Satış Noktaları / Bayiler” bölümünü kontrol edebilirsiniz.',
  },
  {
    id: 'genel-6',
    category: 'Genel',
    question: 'Taksit seçeneği neden yok?',
    answer:
      'Taksit seçeneği banka/ödeme sağlayıcı anlaşmalarına bağlıdır. Bazı ödeme yöntemlerinde veya kampanya dışı ürünlerde taksit seçeneği görünmeyebilir. Ödeme sayfasında görünmeyen kartlar için bankanızla iletişime geçebilirsiniz.',
  },
  {
    id: 'genel-7',
    category: 'Genel',
    question: 'Siparişimi nasıl iptal edebilirim?',
    answer:
      'Siparişiniz kargoya verilmeden önce hesabınızdaki sipariş detayından iptal talebi oluşturabilirsiniz veya müşteri hizmetleriyle iletişime geçebilirsiniz. Sipariş kargoya verildiyse iptal yerine iade prosedürü uygulanır; iade koşulları ve süreç için iade politikasına bakınız.',
  },
  {
    id: 'genel-8',
    category: 'Genel',
    question: 'Sattığınız ürünler ilaç mıdır?',
    answer:
      'Ürünlerimiz gıda takviyesi / supplement kategorisindedir; reçeteli ilaç değildir. Sağlık sorununuz veya düzenli kullandığınız ilaçlar varsa, kullanmadan önce doktorunuza danışınız.',
  },
  {
    id: 'genel-9',
    category: 'Genel',
    question: 'İptal ve iade ettiğim ürünlerin tutarı hesabıma ne zaman aktarılır ?',
    answer:
      'İade edilen ürün bize ulaşıp kalite kontrolü geçtikten sonra geri ödeme süreci başlar. Ödeme yönteminize göre para iadesi genellikle 3–14 iş günü arasında banka süreçlerine bağlı olarak gerçekleşir. Net süre bankanıza göre değişebilir.',
  },
  {
   id: 'genel-10',
    category: 'Genel',
    question: 'Siparişimi teslim alırken nelere dikkat etmeliyim ?',
    answer:
      'Siparişinizi teslim alırken, paketin hasar görmemiş olmasına dikkat ediniz. Herhangi bir hasar durumunda, kargo görevlisine tutanak tutturup, bizimle iletişime geçiniz.',
  },

  // --- Ürünler
  {
    id: 'urun-1',
    category: 'Ürünler',
    question: 'Yüksek proteinli ürünleri kimler kullanabilir?',
    answer:
      'Yüksek protein içeren ürünler genelde sporcular, aktif yaşam süren yetişkinler ve ekstra protein ihtiyacı olan kişiler için uygundur. Çocuklar, hamile veya emziren kadınlar ile kronik rahatsızlığı olanlar kullanmadan önce doktor/uzmana danışmalıdır.',
  },
  {
    id: 'urun-2',
    category: 'Ürünler',
    question: 'Kapağın altındaki folyo açılmış veya tam yapışmamış gibi duruyor?',
    answer:
      'Teslimatta folyonun açılmış veya zarar görmüş olduğunu görürseniz kargo görevlisine durumu bildirin ve fotoğraf çekin. Paketi kabul etmeden önce hasarı not ettirin, ardından müşteri hizmetlerine fotoğrafla birlikte bildirin; gerekli görülürse iade/değişim sürecini başlatırız.',
  },

  // --- Kargo
  {
    id: 'kargo-1',
    category: 'Kargo',
    question: 'Kapıda ödeme hizmetiniz var mı?',
    answer:
      'Kapıda ödeme seçeneği bazı bölgelere ve kampanyalara bağlı olarak sunulmaktadır. Ödeme ekranında kapıda ödeme seçeneği görünüyorsa aktif demektir. Açık değilse ilgili sipariş ve bölge için müşteri hizmetleriyle iletişime geçebilirsiniz.',
  },
  {
    id: 'kargo-2',
    category: 'Kargo',
    question: 'Sipariş takibimi nasıl yapabilirim ?',
    answer:
      'Siparişiniz kargoya verildiğinde e-posta ve SMS ile takip numarası gönderilir. Ayrıca hesabınız > Siparişler bölümünden ilgili siparişin takip numarasına ve kargo durumuna ulaşabilirsiniz.',
  },
];