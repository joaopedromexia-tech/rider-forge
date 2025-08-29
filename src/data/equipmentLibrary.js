// Biblioteca de Equipamentos - Rider Forge
// Estrutura: { categoria, marca, modelo, tags, phantom, notas, isPro, splMax?, sensibilidade?, suportePhantomEstrito?, instrumentoSugerido? }

export const EQUIPMENT_LIBRARY = {
  // BIBLIOTECA FREE
  FREE: [
    // MICROFONES / FONTES (FREE)
    {
      categoria: "mic",
      marca: "Shure",
      modelo: "Beta 91A",
      tags: ["kick", "kick-in", "bumbo"],
      phantom: true,
      notas: "Microfone de bumbo interno",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Shure",
      modelo: "Beta 52A",
      tags: ["kick", "kick-out", "bumbo"],
      phantom: false,
      notas: "Microfone de bumbo externo",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Shure",
      modelo: "Beta 57A",
      tags: ["snare", "caixa", "instrumentos"],
      phantom: false,
      notas: "Microfone de caixa superior",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Shure",
      modelo: "SM57",
      tags: ["snare", "caixa", "instrumentos", "guitarra"],
      phantom: false,
      notas: "Microfone dinâmico versátil",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Shure",
      modelo: "SM58",
      tags: ["vocal", "talkback", "voz"],
      phantom: false,
      notas: "Microfone vocal / talkback",
      sensibilidade: "-54.5 dBV/Pa",
      instrumentoSugerido: ["vocal"],
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "e604",
      tags: ["toms", "instrumentos", "percussão"],
      phantom: false,
      notas: "Microfone dinâmico para toms e instrumentos",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "e904",
      tags: ["snare", "toms", "instrumentos"],
      phantom: false,
      notas: "Microfone de caixa inferior / toms",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "MKH 416",
      tags: ["ambience", "ambiente", "overhead"],
      phantom: true,
      notas: "Microfone de ambiente",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Universal Audio",
      modelo: "SP-1",
      tags: ["overhead", "hi-hat", "ride"],
      phantom: true,
      notas: "Microfone condenser para overheads",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Universal Audio",
      modelo: "SC-1",
      tags: ["overhead", "overheads"],
      phantom: true,
      notas: "Microfone condenser para overheads",
      isPro: false
    },
    // Adicionando equipamentos Free para marcas que estavam faltando
    {
      categoria: "mic",
      marca: "Telefunken",
      modelo: "M80",
      tags: ["vocal", "vocais"],
      phantom: false,
      notas: "Microfone vocal Telefunken",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Neumann",
      modelo: "KM184",
      tags: ["overhead", "instrumentos", "condenser"],
      phantom: true,
      notas: "Microfone condenser Neumann",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "AKG",
      modelo: "D112",
      tags: ["kick", "bumbo"],
      phantom: false,
      notas: "Microfone de bumbo AKG",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Audix",
      modelo: "i5",
      tags: ["snare", "caixa", "instrumentos"],
      phantom: false,
      notas: "Microfone de caixa Audix",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "DPA",
      modelo: "4099",
      tags: ["instrumentos", "condenser"],
      phantom: true,
      notas: "Microfone condenser para instrumentos DPA",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Rode",
      modelo: "NT5",
      tags: ["overhead", "instrumentos", "condenser"],
      phantom: true,
      notas: "Microfone condenser Rode",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Electro-Voice",
      modelo: "RE20",
      tags: ["vocal", "baixo"],
      phantom: false,
      notas: "Microfone dinâmico Electro-Voice",
      isPro: false
    },

    // Adições (FREE) – Microfones dinâmicos e condensadores populares
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "e835",
      tags: ["vocal", "dinamico", "live"],
      phantom: false,
      notas: "Dinâmico cardioide para vocais",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "e914",
      tags: ["overhead", "hi-hat", "condenser"],
      phantom: true,
      notas: "Condenser pequeno diafragma para OH/hi-hat",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "AKG",
      modelo: "C451 B",
      tags: ["overhead", "acustica", "condenser"],
      phantom: true,
      notas: "Condenser clássico para pratos e acústicas",
      isPro: false
    },
    {
      categoria: "mic",
      marca: "Audio-Technica",
      modelo: "AT4040",
      tags: ["vocal", "instrumentos", "condenser"],
      phantom: true,
      notas: "Condenser multiuso",
      isPro: false
    },

    // DI / CAIXAS DE INJEÇÃO (FREE)
    {
      categoria: "di",
      marca: "Radial",
      modelo: "J48",
      tags: ["bass", "baixo", "instrumentos"],
      phantom: true,
      notas: "DI ativo para baixo",
      isPro: false
    },
    {
      categoria: "di",
      marca: "BSS",
      modelo: "AR-133",
      tags: ["guitarra", "keys", "teclados"],
      phantom: true,
      notas: "DI ativo para guitarra acústica e teclados",
      isPro: false
    },
    {
      categoria: "di",
      marca: "Radial",
      modelo: "PZ DI",
      tags: ["guitarra", "acústica", "piezo"],
      phantom: true,
      notas: "DI piezo para guitarra acústica",
      isPro: false
    },
    // Adicionando equipamentos Free para marcas que estavam faltando
    {
      categoria: "di",
      marca: "Countryman",
      modelo: "Type 85",
      tags: ["instrumentos"],
      phantom: true,
      notas: "DI ativo Countryman",
      isPro: false
    },
    {
      categoria: "di",
      marca: "Rupert Neve",
      modelo: "RNDI",
      tags: ["instrumentos"],
      phantom: true,
      notas: "DI ativo Rupert Neve",
      isPro: false
    },

    // Adições (FREE) – DI Boxes comuns
    {
      categoria: "di",
      marca: "Radial",
      modelo: "ProDI",
      tags: ["instrumentos", "passive"],
      phantom: false,
      notas: "DI passivo Radial ProDI",
      isPro: false
    },
    {
      categoria: "di",
      marca: "Radial",
      modelo: "Pro48",
      tags: ["instrumentos", "active"],
      phantom: true,
      notas: "DI ativo Radial Pro48",
      isPro: false
    },
    {
      categoria: "di",
      marca: "Behringer",
      modelo: "DI100",
      tags: ["instrumentos", "active"],
      phantom: true,
      notas: "DI ativo Behringer DI100",
      isPro: false
    },
    {
      categoria: "di",
      marca: "ART",
      modelo: "DTI",
      tags: ["isolador", "transformer", "passive"],
      phantom: false,
      notas: "Caixa de isolamento passiva ART DTI",
      isPro: false
    },
    {
      categoria: "di",
      marca: "Whirlwind",
      modelo: "IMP 2",
      tags: ["instrumentos", "passive"],
      phantom: false,
      notas: "DI passivo Whirlwind IMP 2",
      isPro: false
    },
    {
      categoria: "di",
      marca: "Pro Co",
      modelo: "DB-1",
      tags: ["instrumentos", "passive"],
      phantom: false,
      notas: "DI passivo Pro Co DB-1",
      isPro: false
    },

    // WIRELESS / IEM (FREE)
    {
      categoria: "wireless",
      marca: "Shure",
      modelo: "AD / ULX-D",
      tags: ["vocal", "wireless", "handheld", "bodypack"],
      phantom: false,
      notas: "Sistema wireless para vocais (Elisa/Guest/Spare)",
      isPro: false
    },
    // Adicionando equipamento Free para Sennheiser wireless
    {
      categoria: "wireless",
      marca: "Sennheiser",
      modelo: "EW 100 G4",
      tags: ["vocal", "wireless", "handheld"],
      phantom: false,
      notas: "Sistema wireless Sennheiser EW 100 G4",
      isPro: false
    },
    {
      categoria: "iem",
      marca: "Sennheiser",
      modelo: "EW IEM G4",
      tags: ["iem", "monitor", "in-ear"],
      phantom: false,
      notas: "Sistema IEM (7 IEMs típicos)",
      isPro: false
    },
    {
      categoria: "iem",
      marca: "Sennheiser",
      modelo: "EW IEM G3",
      tags: ["iem", "monitor", "in-ear"],
      phantom: false,
      notas: "Sistema IEM Sennheiser G3",
      isPro: false
    },
    {
      categoria: "iem",
      marca: "Shure",
      modelo: "PSM300",
      tags: ["iem", "monitor", "in-ear"],
      phantom: false,
      notas: "Sistema IEM Shure PSM300",
      isPro: false
    },
    {
      categoria: "iem",
      marca: "Shure",
      modelo: "PSM900",
      tags: ["iem", "monitor", "in-ear"],
      phantom: false,
      notas: "Sistema IEM Shure PSM900",
      isPro: false
    },
    {
      categoria: "iem",
      marca: "Shure",
      modelo: "PSM1000",
      tags: ["iem", "monitor", "in-ear"],
      phantom: false,
      notas: "Sistema IEM Shure PSM1000",
      isPro: false
    },
    {
      categoria: "iem",
      marca: "Audio-Technica",
      modelo: "M3 IEM",
      tags: ["iem", "monitor", "in-ear"],
      phantom: false,
      notas: "Sistema IEM Audio-Technica M3",
      isPro: false
    },
    {
      categoria: "iem",
      marca: "Audio-Technica",
      modelo: "M2 IEM",
      tags: ["iem", "monitor", "in-ear"],
      phantom: false,
      notas: "Sistema IEM Audio-Technica M2",
      isPro: false
    },
    {
      categoria: "iem",
      marca: "Audio-Technica",
      modelo: "M1 IEM",
      tags: ["iem", "monitor", "in-ear"],
      phantom: false,
      notas: "Sistema IEM Audio-Technica M1",
      isPro: false
    },
    {
      categoria: "iem",
      marca: "Sennheiser",
      modelo: "2000 IEM",
      tags: ["iem", "monitor", "in-ear"],
      phantom: false,
      notas: "Sistema IEM Sennheiser 2000",
      isPro: false
    },
    {
      categoria: "iem",
      marca: "Wisycom",
      modelo: "MTK952",
      tags: ["iem", "monitor", "transmitter"],
      phantom: false,
      notas: "Sistema IEM Wisycom MTK952",
      isPro: false
    },
    {
      categoria: "iem",
      marca: "Wisycom",
      modelo: "MTK962",
      tags: ["iem", "monitor", "transmitter"],
      phantom: false,
      notas: "Sistema IEM Wisycom MTK962",
      isPro: false
    },
    {
      categoria: "wireless",
      marca: "Lectrosonics",
      modelo: "Venue2",
      tags: ["wireless", "receiver"],
      phantom: false,
      notas: "Recetor wireless multicanal Lectrosonics Venue2",
      isPro: false
    },
    {
      categoria: "wireless",
      marca: "Lectrosonics",
      modelo: "Venue3",
      tags: ["wireless", "receiver"],
      phantom: false,
      notas: "Recetor wireless multicanal Lectrosonics Venue3",
      isPro: false
    },
    {
      categoria: "wireless",
      marca: "Zaxcom",
      modelo: "TRX900",
      tags: ["wireless", "transmitter"],
      phantom: false,
      notas: "Transmissor wireless bodypack Zaxcom TRX900",
      isPro: false
    },
    {
      categoria: "wireless",
      marca: "Zaxcom",
      modelo: "TRX900AA",
      tags: ["wireless", "transmitter"],
      phantom: false,
      notas: "Transmissor wireless bodypack Zaxcom TRX900AA",
      isPro: false
    },
    // Adicionando equipamentos Free para marcas que estavam faltando
    {
      categoria: "processor",
      marca: "L-Acoustics",
      modelo: "P1",
      tags: ["processor", "system"],
      phantom: false,
      notas: "Processador de sistema L-Acoustics P1",
      isPro: false
    },
    {
      categoria: "amp",
      marca: "d&b audiotechnik",
      modelo: "D80",
      tags: ["amplifier", "power"],
      phantom: false,
      notas: "Amplificador de potência d&b D80",
      isPro: false
    },
    {
      categoria: "processor",
      marca: "Meyer Sound",
      modelo: "Galileo 616",
      tags: ["processor", "system"],
      phantom: false,
      notas: "Processador de sistema Meyer Sound Galileo 616",
      isPro: false
    },

    // CONSOLAS (FREE)
    {
      categoria: "console",
      marca: "Midas",
      modelo: "Pro Series",
      tags: ["foh", "console", "digital"],
      phantom: null,
      notas: "Consola digital Midas",
      isPro: false
    },
    {
      categoria: "console",
      marca: "Midas",
      modelo: "HD96",
      tags: ["foh", "console", "digital"],
      phantom: null,
      notas: "Consola digital Midas HD96",
      isPro: false
    },
    {
      categoria: "console",
      marca: "Yamaha",
      modelo: "CL5",
      tags: ["foh", "console", "digital"],
      phantom: null,
      notas: "Consola digital Yamaha CL5",
      isPro: false
    },
    {
      categoria: "console",
      marca: "Yamaha",
      modelo: "DM7",
      tags: ["foh", "console", "digital"],
      phantom: null,
      notas: "Consola digital Yamaha DM7",
      isPro: false
    },
    {
      categoria: "console",
      marca: "Allen & Heath",
      modelo: "dLive",
      tags: ["foh", "console", "digital"],
      phantom: null,
      notas: "Consola digital Allen & Heath dLive",
      isPro: false
    },
    // Adicionando equipamentos Free para marcas que estavam faltando
    {
      categoria: "console",
      marca: "DiGiCo",
      modelo: "SD9",
      tags: ["foh", "console", "digital"],
      phantom: null,
      notas: "Consola digital DiGiCo SD9",
      isPro: false
    },
    {
      categoria: "console",
      marca: "Avid",
      modelo: "VENUE S6L",
      tags: ["foh", "console", "digital"],
      phantom: null,
      notas: "Consola digital Avid VENUE S6L",
      isPro: false
    },
    {
      categoria: "console",
      marca: "Soundcraft",
      modelo: "Vi Series",
      tags: ["foh", "console", "digital"],
      phantom: null,
      notas: "Consola digital Soundcraft Vi Series",
      isPro: false
    },
    {
      categoria: "console",
      marca: "Behringer",
      modelo: "X32",
      tags: ["foh", "console", "digital"],
      phantom: null,
      notas: "Consola digital Behringer X32",
      isPro: false
    },

    // STANDS (FREE)
    {
      categoria: "stand",
      marca: "Genérico",
      modelo: "Clamp",
      tags: ["clamp", "fixação"],
      phantom: null,
      notas: "Fixação tipo clamp",
      isPro: false
    },
    {
      categoria: "stand",
      marca: "Genérico",
      modelo: "Chão/Tripé",
      tags: ["chão", "tripé", "ground"],
      phantom: null,
      notas: "Tripé de chão",
      isPro: false
    },
    {
      categoria: "stand",
      marca: "Genérico",
      modelo: "Short",
      tags: ["short", "curto"],
      phantom: null,
      notas: "Stand curto",
      isPro: false
    },
    {
      categoria: "stand",
      marca: "Genérico",
      modelo: "Tall",
      tags: ["tall", "alto"],
      phantom: null,
      notas: "Stand alto",
      isPro: false
    },
    {
      categoria: "stand",
      marca: "Genérico",
      modelo: "Boom",
      tags: ["boom", "braço"],
      phantom: null,
      notas: "Stand com braço boom",
      isPro: false
    },
    {
      categoria: "stand",
      marca: "Genérico",
      modelo: "Clip",
      tags: ["clip", "fixação"],
      phantom: null,
      notas: "Fixação tipo clip",
      isPro: false
    },

    // SISTEMAS DE SAÍDA (FREE)
    {
      categoria: "sistema",
      marca: "Sistema",
      modelo: "PA L/R",
      tags: ["pa", "principal", "matrix"],
      phantom: null,
      notas: "PA Principal (Matrix 1/2)",
      isPro: false
    },
    {
      categoria: "sistema",
      marca: "Sistema",
      modelo: "Sub",
      tags: ["sub", "subwoofer", "matrix"],
      phantom: null,
      notas: "Subwoofer (Matrix 3)",
      isPro: false
    },
    {
      categoria: "sistema",
      marca: "Sistema",
      modelo: "Front Fill",
      tags: ["fill", "front", "matrix"],
      phantom: null,
      notas: "Front Fill (Matrix 4)",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "JBL",
      modelo: "SRX835P",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill JBL SRX835P",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "Electro-Voice",
      modelo: "QRX212",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill EV QRX212",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "Meyer Sound",
      modelo: "UPQ-1P",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill Meyer UPQ-1P",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "QSC",
      modelo: "K12.2",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill QSC K12.2",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "QSC",
      modelo: "K10.2",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill QSC K10.2",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "Yamaha",
      modelo: "DXR12",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill Yamaha DXR12",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "Yamaha",
      modelo: "DXR10",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill Yamaha DXR10",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "Electro-Voice",
      modelo: "ELX200-12P",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill EV ELX200-12P",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "Electro-Voice",
      modelo: "ELX200-10P",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill EV ELX200-10P",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "JBL",
      modelo: "EON712",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill JBL EON712",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "JBL",
      modelo: "EON710",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill JBL EON710",
      isPro: false
    },
    // Adicionando equipamentos Free para marcas que estavam faltando
    {
      categoria: "sidefill",
      marca: "L-Acoustics",
      modelo: "X12",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill L-Acoustics X12",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "d&b audiotechnik",
      modelo: "M4",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill d&b M4",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "Martin Audio",
      modelo: "W8LM",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill Martin Audio W8LM",
      isPro: false
    },
    {
      categoria: "sidefill",
      marca: "Nexo",
      modelo: "M6",
      tags: ["side", "fill", "monitor", "palco"],
      phantom: null,
      notas: "Side Fill Nexo M6",
      isPro: false
    },

    // WEDGES (FREE)
    {
      categoria: "wedge",
      marca: "JBL",
      modelo: "SRX835P",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge JBL SRX835P",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "Electro-Voice",
      modelo: "QRX212",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge EV QRX212",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "Meyer Sound",
      modelo: "UPQ-1P",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge Meyer UPQ-1P",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "QSC",
      modelo: "K12.2",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge QSC K12.2",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "QSC",
      modelo: "K10.2",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge QSC K10.2",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "QSC",
      modelo: "K8.2",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge QSC K8.2",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "Yamaha",
      modelo: "DXR12",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge Yamaha DXR12",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "Yamaha",
      modelo: "DXR10",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge Yamaha DXR10",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "Yamaha",
      modelo: "DXR8",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge Yamaha DXR8",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "Electro-Voice",
      modelo: "ELX200-12P",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge EV ELX200-12P",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "Electro-Voice",
      modelo: "ELX200-10P",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge EV ELX200-10P",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "Electro-Voice",
      modelo: "ELX200-8P",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge EV ELX200-8P",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "JBL",
      modelo: "EON712",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge JBL EON712",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "JBL",
      modelo: "EON710",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge JBL EON710",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "JBL",
      modelo: "EON708",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge JBL EON708",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "dB Technologies",
      modelo: "DVA T4",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge dB Technologies DVA T4",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "dB Technologies",
      modelo: "DVA T8",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge dB Technologies DVA T8",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "Alto Professional",
      modelo: "TS312",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge Alto Professional TS312",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "Alto Professional",
      modelo: "TS310",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge Alto Professional TS310",
      isPro: false
    },
    // Adicionando equipamentos Free para marcas que estavam faltando
    {
      categoria: "wedge",
      marca: "L-Acoustics",
      modelo: "X12",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge L-Acoustics X12",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "d&b audiotechnik",
      modelo: "M4",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge d&b M4",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "Martin Audio",
      modelo: "W8LM",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge Martin Audio W8LM",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "Nexo",
      modelo: "M6",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge Nexo M6",
      isPro: false
    },
    {
      categoria: "wedge",
      marca: "EAW",
      modelo: "JF60",
      tags: ["wedge", "monitor", "palco"],
      phantom: null,
      notas: "Wedge EAW JF60",
      isPro: false
    },
    {
      categoria: "sistema",
      marca: "Sistema",
      modelo: "Side Fill",
      tags: ["fill", "side", "palco"],
      phantom: null,
      notas: "Side Fill (sistema adicional de palco)",
      isPro: false
    },
    {
      categoria: "sistema",
      marca: "Sistema",
      modelo: "Drum Sub 15\"",
      tags: ["drum", "sub", "bateria"],
      phantom: null,
      notas: "Subwoofer para bateria 15\"",
      isPro: false
    },
    // Adicionando equipamentos Free para PA
    {
      categoria: "pa",
      marca: "L-Acoustics",
      modelo: "Kara",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array L-Acoustics Kara",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "Meyer Sound",
      modelo: "LEO",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array Meyer Sound LEO",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "d&b audiotechnik",
      modelo: "V-Series",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array d&b V-Series",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "Martin Audio",
      modelo: "WPL",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array Martin Audio WPL",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "Nexo",
      modelo: "GEO M12",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array Nexo GEO M12",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "EAW",
      modelo: "KF850",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array EAW KF850",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "JBL",
      modelo: "VTX V25",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array JBL VTX V25",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "Yamaha",
      modelo: "DZR",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array Yamaha DZR",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "Bose",
      modelo: "ShowMatch",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array Bose ShowMatch",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "EV",
      modelo: "X-Line",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array EV X-Line",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "Adamson",
      modelo: "E15",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array Adamson E15",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "RCF",
      modelo: "HDL 30-A",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array RCF HDL 30-A",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "dBTechnologies",
      modelo: "VIO L212",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array dBTechnologies VIO L212",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "Electro-Voice",
      modelo: "X2",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array EV X2",
      isPro: false
    },
    // Adicionando equipamentos Free para marcas especializadas
    {
      categoria: "fx",
      marca: "Bricasti",
      modelo: "M7",
      tags: ["reverb", "fx"],
      phantom: null,
      notas: "Reverb Bricasti M7",
      isPro: false
    },
    {
      categoria: "fx",
      marca: "Lexicon",
      modelo: "PCM",
      tags: ["reverb", "delay", "fx"],
      phantom: null,
      notas: "Reverb/Delay Lexicon PCM",
      isPro: false
    },
    {
      categoria: "fx",
      marca: "TC Electronic",
      modelo: "M3000",
      tags: ["reverb", "fx"],
      phantom: null,
      notas: "Reverb TC Electronic M3000",
      isPro: false
    },
    {
      categoria: "fx",
      marca: "Eventide",
      modelo: "H9",
      tags: ["fx"],
      phantom: null,
      notas: "Processador de efeitos Eventide H9",
      isPro: false
    },
    {
      categoria: "stand",
      marca: "K&M",
      modelo: "210",
      tags: ["stand"],
      phantom: null,
      notas: "Stand K&M 210",
      isPro: false
    },
    {
      categoria: "stand",
      marca: "Hercules",
      modelo: "Stand Profissional",
      tags: ["stand"],
      phantom: null,
      notas: "Stand profissional Hercules",
      isPro: false
    }
  ],

  // BIBLIOTECA PRO
  PRO: [
    // MICROFONES (PRO) - Vocais
    {
      categoria: "mic",
      marca: "Shure",
      modelo: "KSM9",
      tags: ["vocal", "vocais", "profissional"],
      phantom: true,
      notas: "Microfone vocal profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Shure",
      modelo: "KSM8",
      tags: ["vocal", "vocais", "profissional"],
      phantom: false,
      notas: "Microfone vocal profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Shure",
      modelo: "Beta 87A",
      tags: ["vocal", "wireless", "profissional"],
      phantom: true,
      notas: "Microfone vocal wireless profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "e935",
      tags: ["vocal", "vocais", "profissional"],
      phantom: false,
      notas: "Microfone vocal profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "e945",
      tags: ["vocal", "vocais", "profissional"],
      phantom: false,
      notas: "Microfone vocal profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "e965",
      tags: ["vocal", "vocais", "profissional"],
      phantom: true,
      notas: "Microfone vocal condenser profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Telefunken",
      modelo: "M80",
      tags: ["vocal", "vocais", "profissional"],
      phantom: false,
      notas: "Microfone vocal profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Neumann",
      modelo: "KMS 105",
      tags: ["vocal", "vocais", "profissional"],
      phantom: true,
      notas: "Microfone vocal condenser profissional",
      isPro: true
    },

    // MICROFONES (PRO) - Bumbo/Toms/Caixa
    {
      categoria: "mic",
      marca: "AKG",
      modelo: "D112 MKII",
      tags: ["kick", "bumbo", "profissional"],
      phantom: false,
      notas: "Microfone de bumbo profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Audix",
      modelo: "D6",
      tags: ["kick", "bumbo", "profissional"],
      phantom: false,
      notas: "Microfone de bumbo profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Audix",
      modelo: "i5",
      tags: ["snare", "caixa", "instrumentos"],
      phantom: false,
      notas: "Microfone de caixa profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Audix",
      modelo: "D2",
      tags: ["toms", "instrumentos"],
      phantom: false,
      notas: "Microfone de toms profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Audix",
      modelo: "D4",
      tags: ["toms", "instrumentos"],
      phantom: false,
      notas: "Microfone de toms profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "e902",
      tags: ["kick", "bumbo", "profissional"],
      phantom: false,
      notas: "Microfone de bumbo profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "e906",
      tags: ["guitarra", "instrumentos", "profissional"],
      phantom: false,
      notas: "Microfone de guitarra profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "e609",
      tags: ["guitarra", "instrumentos", "profissional"],
      phantom: false,
      notas: "Microfone de guitarra profissional",
      isPro: true
    },

    // MICROFONES (PRO) - Instrumentos/Condenser
    {
      categoria: "mic",
      marca: "Neumann",
      modelo: "KM184",
      tags: ["overhead", "instrumentos", "condenser"],
      phantom: true,
      notas: "Microfone condenser profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "DPA",
      modelo: "4099",
      tags: ["instrumentos", "condenser", "profissional"],
      phantom: true,
      notas: "Microfone condenser para instrumentos",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "AKG",
      modelo: "C414",
      tags: ["overhead", "instrumentos", "condenser"],
      phantom: true,
      notas: "Microfone condenser profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "MD421-II",
      tags: ["instrumentos", "profissional"],
      phantom: false,
      notas: "Microfone dinâmico para instrumentos",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Rode",
      modelo: "NT5",
      tags: ["overhead", "instrumentos", "condenser"],
      phantom: true,
      notas: "Microfone condenser para overheads",
      isPro: true
    },

    // Adições (PRO) – Microfones vocais/instrumentos premium
    {
      categoria: "mic",
      marca: "Neumann",
      modelo: "U87 Ai",
      tags: ["vocal", "studio", "condenser"],
      phantom: true,
      notas: "Condenser de grande diafragma clássico",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Schoeps",
      modelo: "CMC6 + MK4",
      tags: ["overhead", "acustica", "condenser"],
      phantom: true,
      notas: "Condenser modular cardioide de referência",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Royer",
      modelo: "R-121",
      tags: ["guitarra", "sopros", "ribbon"],
      phantom: false,
      notas: "Ribbon passivo para guitarras e metais",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Beyerdynamic",
      modelo: "M88 TG",
      tags: ["kick", "vocal", "dinamico"],
      phantom: false,
      notas: "Dinâmico hiper-cardioide, comum em kick e vocais",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Sennheiser",
      modelo: "MD 441-U",
      tags: ["snare", "vocal", "dinamico"],
      phantom: false,
      notas: "Dinâmico super-cardioide de referência",
      isPro: true
    },

    // MICROFONES (PRO) - Dinâmicos clássicos
    {
      categoria: "mic",
      marca: "Electro-Voice",
      modelo: "RE20",
      tags: ["vocal", "baixo", "profissional"],
      phantom: false,
      notas: "Microfone dinâmico profissional",
      isPro: true
    },
    {
      categoria: "mic",
      marca: "Shure",
      modelo: "SM7B",
      tags: ["vocal", "profissional"],
      phantom: false,
      notas: "Microfone dinâmico profissional",
      isPro: true
    },

    // DI (PRO)
    {
      categoria: "di",
      marca: "Radial",
      modelo: "JDI",
      tags: ["bass", "baixo", "profissional"],
      phantom: false,
      notas: "DI passivo para baixo",
      isPro: true
    },
    {
      categoria: "di",
      marca: "Radial",
      modelo: "ProD2",
      tags: ["instrumentos", "profissional"],
      phantom: false,
      notas: "DI passivo profissional",
      isPro: true
    },
    {
      categoria: "di",
      marca: "Countryman",
      modelo: "Type 85",
      tags: ["instrumentos", "profissional"],
      phantom: true,
      notas: "DI ativo profissional",
      isPro: true
    },
    {
      categoria: "di",
      marca: "Rupert Neve",
      modelo: "RNDI",
      tags: ["instrumentos", "profissional"],
      phantom: true,
      notas: "DI ativo profissional",
      isPro: true
    },

    // Adições (PRO) – DI Boxes premium
    {
      categoria: "di",
      marca: "Countryman",
      modelo: "Type 10",
      tags: ["instrumentos", "active", "profissional"],
      phantom: true,
      notas: "DI ativo com headroom elevado",
      isPro: true
    },
    {
      categoria: "di",
      marca: "Radial",
      modelo: "J48 Stereo",
      tags: ["instrumentos", "active", "stereo", "profissional"],
      phantom: true,
      notas: "DI ativo estéreo a phantom",
      isPro: true
    },
    {
      categoria: "di",
      marca: "Rupert Neve",
      modelo: "RNDI-S",
      tags: ["instrumentos", "active", "stereo", "profissional"],
      phantom: true,
      notas: "DI ativo estéreo a phantom",
      isPro: true
    },
    {
      categoria: "di",
      marca: "Avalon",
      modelo: "U5",
      tags: ["instrumentos", "active", "rack", "profissional"],
      phantom: false,
      notas: "DI ativo alimentado por AC (não requer 48V)",
      isPro: true
    },

    // Adições (PRO) – Consolas e PA
    {
      categoria: "console",
      marca: "Solid State Logic",
      modelo: "Live L500",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola SSL Live L500",
      isPro: true
    },
    {
      categoria: "console",
      marca: "Solid State Logic",
      modelo: "Live L300",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola SSL Live L300",
      isPro: true
    },
    {
      categoria: "console",
      marca: "DiGiCo",
      modelo: "Quantum 7",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola DiGiCo Quantum 7",
      isPro: true
    },
    {
      categoria: "console",
      marca: "Yamaha",
      modelo: "Rivage PM10",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola Yamaha Rivage PM10",
      isPro: true
    },
    {
      categoria: "console",
      marca: "Allen & Heath",
      modelo: "Avantis",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola Allen & Heath Avantis",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "RCF",
      modelo: "HDL 50-A 4K",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Line Array RCF HDL 50-A 4K",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "d&b audiotechnik",
      modelo: "V8",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Módulo de line array d&b V8",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Outline",
      modelo: "GTO C-12",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Line Array Outline GTO C-12",
      isPro: true
    },

    // Adições (PRO) – Wedges e Side Fill
    {
      categoria: "wedge",
      marca: "Meyer Sound",
      modelo: "MJF-210",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge Meyer Sound MJF-210",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "Meyer Sound",
      modelo: "MJF-212A",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge Meyer Sound MJF-212A",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "L-Acoustics",
      modelo: "ARCS Focus",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill L-Acoustics ARCS Focus",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "L-Acoustics",
      modelo: "ARCS Wide",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill L-Acoustics ARCS Wide",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "Meyer Sound",
      modelo: "UPQ-D1",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill Meyer Sound UPQ-D1",
      isPro: true
    },

    // CONSOLAS (PRO)
    {
      categoria: "console",
      marca: "DiGiCo",
      modelo: "SD9",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola digital profissional",
      isPro: true
    },
    {
      categoria: "console",
      marca: "DiGiCo",
      modelo: "SD10",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola digital profissional",
      isPro: true
    },
    {
      categoria: "console",
      marca: "DiGiCo",
      modelo: "SD12",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola digital profissional",
      isPro: true
    },
    {
      categoria: "console",
      marca: "DiGiCo",
      modelo: "Quantum 225",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola digital profissional",
      isPro: true
    },
    {
      categoria: "console",
      marca: "DiGiCo",
      modelo: "Quantum 338",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola digital profissional",
      isPro: true
    },
    {
      categoria: "console",
      marca: "Avid",
      modelo: "VENUE S6L",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola digital profissional",
      isPro: true
    },
    {
      categoria: "console",
      marca: "Yamaha",
      modelo: "Rivage PM7",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola digital profissional",
      isPro: true
    },
    {
      categoria: "console",
      marca: "Yamaha",
      modelo: "Rivage PM5",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola digital profissional",
      isPro: true
    },
    {
      categoria: "console",
      marca: "Allen & Heath",
      modelo: "dLive S Class",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola digital profissional",
      isPro: true
    },
    {
      categoria: "console",
      marca: "Allen & Heath",
      modelo: "dLive C Class",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola digital profissional",
      isPro: true
    },
    {
      categoria: "console",
      marca: "Soundcraft",
      modelo: "Vi Series",
      tags: ["foh", "console", "digital", "profissional"],
      phantom: null,
      notas: "Consola digital profissional",
      isPro: true
    },
    {
      categoria: "console",
      marca: "Behringer",
      modelo: "X32",
      tags: ["foh", "console", "digital"],
      phantom: null,
      notas: "Consola digital popular",
      isPro: true
    },
    {
      categoria: "console",
      marca: "Behringer",
      modelo: "Wing",
      tags: ["foh", "console", "digital"],
      phantom: null,
      notas: "Consola digital popular",
      isPro: true
    },

    // WIRELESS / IEM (PRO)
    {
      categoria: "wireless",
      marca: "Shure",
      modelo: "Axient Digital AD",
      tags: ["vocal", "wireless", "profissional"],
      phantom: false,
      notas: "Sistema wireless profissional",
      isPro: true
    },
    {
      categoria: "wireless",
      marca: "Shure",
      modelo: "Axient Digital ADX",
      tags: ["vocal", "wireless", "profissional"],
      phantom: false,
      notas: "Sistema wireless profissional",
      isPro: true
    },
    {
      categoria: "iem",
      marca: "Shure",
      modelo: "PSM1000",
      tags: ["iem", "monitor", "profissional"],
      phantom: false,
      notas: "Sistema IEM profissional",
      isPro: true
    },
    {
      categoria: "iem",
      marca: "Shure",
      modelo: "Axient Digital PSM",
      tags: ["iem", "monitor", "profissional"],
      phantom: false,
      notas: "Sistema IEM profissional",
      isPro: true
    },
    {
      categoria: "wireless",
      marca: "Sennheiser",
      modelo: "Digital 6000",
      tags: ["vocal", "wireless", "profissional"],
      phantom: false,
      notas: "Sistema wireless profissional",
      isPro: true
    },
    {
      categoria: "wireless",
      marca: "Sennheiser",
      modelo: "Digital 9000",
      tags: ["vocal", "wireless", "profissional"],
      phantom: false,
      notas: "Sistema wireless profissional",
      isPro: true
    },
    {
      categoria: "iem",
      marca: "Sennheiser",
      modelo: "2000 IEM",
      tags: ["iem", "monitor", "profissional"],
      phantom: false,
      notas: "Sistema IEM profissional",
      isPro: true
    },
    // Removidos modelos inexistentes "3000/6000/9000 IEM"
    {
      categoria: "iem",
      marca: "Shure",
      modelo: "Axient Digital PSM",
      tags: ["iem", "monitor", "profissional"],
      phantom: false,
      notas: "Sistema IEM profissional Shure Axient Digital",
      isPro: true
    },
    {
      categoria: "iem",
      marca: "Shure",
      modelo: "PSM1000",
      tags: ["iem", "monitor", "profissional"],
      phantom: false,
      notas: "Sistema IEM profissional Shure PSM1000",
      isPro: true
    },
    {
      categoria: "iem",
      marca: "Shure",
      modelo: "PSM900",
      tags: ["iem", "monitor", "profissional"],
      phantom: false,
      notas: "Sistema IEM profissional Shure PSM900",
      isPro: true
    },
    {
      categoria: "iem",
      marca: "Audio-Technica",
      modelo: "M3 IEM",
      tags: ["iem", "monitor", "profissional"],
      phantom: false,
      notas: "Sistema IEM profissional Audio-Technica M3",
      isPro: true
    },
    {
      categoria: "iem",
      marca: "Audio-Technica",
      modelo: "M2 IEM",
      tags: ["iem", "monitor", "profissional"],
      phantom: false,
      notas: "Sistema IEM profissional Audio-Technica M2",
      isPro: true
    },
    {
      categoria: "iem",
      marca: "Audio-Technica",
      modelo: "M1 IEM",
      tags: ["iem", "monitor", "profissional"],
      phantom: false,
      notas: "Sistema IEM profissional Audio-Technica M1",
      isPro: true
    },
    {
      categoria: "iem",
      marca: "Wisycom",
      modelo: "MTK952",
      tags: ["iem", "monitor", "profissional"],
      phantom: false,
      notas: "Sistema IEM profissional Wisycom MTK952",
      isPro: true
    },
    {
      categoria: "iem",
      marca: "Wisycom",
      modelo: "MTK962",
      tags: ["iem", "monitor", "profissional"],
      phantom: false,
      notas: "Sistema IEM profissional Wisycom MTK962",
      isPro: true
    },
    {
      categoria: "iem",
      marca: "Wisycom",
      modelo: "MTK972",
      tags: ["iem", "monitor", "profissional"],
      phantom: false,
      notas: "Sistema IEM profissional Wisycom MTK972",
      isPro: true
    },
    {
      categoria: "wireless",
      marca: "Lectrosonics",
      modelo: "Venue2",
      tags: ["wireless", "receiver", "profissional"],
      phantom: false,
      notas: "Recetor wireless multicanal Lectrosonics Venue2",
      isPro: true
    },
    {
      categoria: "wireless",
      marca: "Lectrosonics",
      modelo: "Venue3",
      tags: ["wireless", "receiver", "profissional"],
      phantom: false,
      notas: "Recetor wireless multicanal Lectrosonics Venue3",
      isPro: true
    },
    {
      categoria: "wireless",
      marca: "Lectrosonics",
      modelo: "Venue4",
      tags: ["wireless", "receiver", "profissional"],
      phantom: false,
      notas: "Recetor wireless multicanal Lectrosonics Venue4",
      isPro: true
    },
    {
      categoria: "wireless",
      marca: "Zaxcom",
      modelo: "TRX900",
      tags: ["wireless", "transmitter", "profissional"],
      phantom: false,
      notas: "Transmissor wireless bodypack Zaxcom TRX900",
      isPro: true
    },
    {
      categoria: "wireless",
      marca: "Zaxcom",
      modelo: "TRX900AA",
      tags: ["wireless", "transmitter", "profissional"],
      phantom: false,
      notas: "Transmissor wireless bodypack Zaxcom TRX900AA",
      isPro: true
    },
    {
      categoria: "wireless",
      marca: "Zaxcom",
      modelo: "TRXLA3",
      tags: ["wireless", "transmitter", "profissional"],
      phantom: false,
      notas: "Transmissor wireless bodypack Zaxcom TRXLA3",
      isPro: true
    },
    {
      categoria: "processor",
      marca: "L-Acoustics",
      modelo: "P1",
      tags: ["processor", "system", "profissional"],
      phantom: false,
      notas: "Processador de sistema L-Acoustics P1",
      isPro: true
    },
    {
      categoria: "amp",
      marca: "d&b audiotechnik",
      modelo: "D80",
      tags: ["amplifier", "power", "profissional"],
      phantom: false,
      notas: "Amplificador de potência d&b D80",
      isPro: true
    },
    {
      categoria: "processor",
      marca: "Meyer Sound",
      modelo: "Galileo 616",
      tags: ["processor", "system", "profissional"],
      phantom: false,
      notas: "Processador de sistema Meyer Sound Galileo 616",
      isPro: true
    },

    // SIDE FILLS (PRO)
    {
      categoria: "sidefill",
      marca: "L-Acoustics",
      modelo: "X12",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill profissional L-Acoustics X12",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "L-Acoustics",
      modelo: "X15",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill profissional L-Acoustics X15",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "d&b audiotechnik",
      modelo: "M4",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill profissional d&b M4",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "d&b audiotechnik",
      modelo: "M6",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill profissional d&b M6",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "Meyer Sound",
      modelo: "UPJ-1P",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill profissional Meyer UPJ-1P",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "Meyer Sound",
      modelo: "UPJunior",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill profissional Meyer UPJunior",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "Martin Audio",
      modelo: "W8LM",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill profissional Martin Audio W8LM",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "Martin Audio",
      modelo: "W8LC",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill profissional Martin Audio W8LC",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "Nexo",
      modelo: "M6",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill profissional Nexo M6",
      isPro: true
    },
    {
      categoria: "sidefill",
      marca: "Nexo",
      modelo: "M8",
      tags: ["side", "fill", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Side Fill profissional Nexo M8",
      isPro: true
    },

    // WEDGES (PRO)
    {
      categoria: "wedge",
      marca: "L-Acoustics",
      modelo: "X12",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional L-Acoustics X12",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "L-Acoustics",
      modelo: "X15",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional L-Acoustics X15",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "d&b audiotechnik",
      modelo: "M4",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional d&b M4",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "d&b audiotechnik",
      modelo: "M6",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional d&b M6",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "d&b audiotechnik",
      modelo: "M2",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional d&b M2",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "Meyer Sound",
      modelo: "UPJ-1P",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional Meyer UPJ-1P",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "Meyer Sound",
      modelo: "UPJunior",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional Meyer UPJunior",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "Martin Audio",
      modelo: "W8LM",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional Martin Audio W8LM",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "Martin Audio",
      modelo: "W8LC",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional Martin Audio W8LC",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "Nexo",
      modelo: "M6",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional Nexo M6",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "Nexo",
      modelo: "M8",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional Nexo M8",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "EAW",
      modelo: "JF60",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional EAW JF60",
      isPro: true
    },
    {
      categoria: "wedge",
      marca: "EAW",
      modelo: "JF80",
      tags: ["wedge", "monitor", "palco", "profissional"],
      phantom: null,
      notas: "Wedge profissional EAW JF80",
      isPro: true
    },

    // FX / PROCESSAMENTO (PRO)
    {
      categoria: "fx",
      marca: "TC Electronic",
      modelo: "D2",
      tags: ["delay", "fx", "profissional"],
      phantom: null,
      notas: "Delay profissional",
      isPro: true
    },

    // PA SYSTEMS (PRO)
    {
      categoria: "pa",
      marca: "L-Acoustics",
      modelo: "K2",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional L-Acoustics K2",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "L-Acoustics",
      modelo: "K3",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional L-Acoustics K3",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "L-Acoustics",
      modelo: "Kara",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional L-Acoustics Kara",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Meyer Sound",
      modelo: "LEO",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional Meyer Sound LEO",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Meyer Sound",
      modelo: "LYON",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional Meyer Sound LYON",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "d&b audiotechnik",
      modelo: "V-Series",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional d&b V-Series",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "d&b audiotechnik",
      modelo: "Y-Series",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional d&b Y-Series",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Martin Audio",
      modelo: "WPL",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional Martin Audio WPL",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Nexo",
      modelo: "GEO M12",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional Nexo GEO M12",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "EAW",
      modelo: "KF850",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional EAW KF850",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "JBL",
      modelo: "VTX V25",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional JBL VTX V25",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Yamaha",
      modelo: "DZR",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional Yamaha DZR",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Bose",
      modelo: "ShowMatch",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional Bose ShowMatch",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "EV",
      modelo: "X-Line",
      tags: ["pa", "linearray", "profissional"],
      phantom: null,
      notas: "Line Array profissional EV X-Line",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "L-Acoustics",
      modelo: "K1",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Line Array flagship L-Acoustics K1",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "L-Acoustics",
      modelo: "Kara II",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Line Array compacto L-Acoustics Kara II",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "L-Acoustics",
      modelo: "A15",
      tags: ["pa", "linearray", "install"],
      phantom: null,
      notas: "Linha A-Series L-Acoustics A15",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "L-Acoustics",
      modelo: "A10",
      tags: ["pa", "linearray", "install"],
      phantom: null,
      notas: "Linha A-Series L-Acoustics A10",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "d&b audiotechnik",
      modelo: "GSL",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Série SL d&b GSL",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "d&b audiotechnik",
      modelo: "KSL",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Série SL d&b KSL",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "d&b audiotechnik",
      modelo: "J-Series",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Clássico touring d&b J-Series",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Meyer Sound",
      modelo: "LEOPARD",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Line Array Meyer LEOPARD",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Meyer Sound",
      modelo: "LINA",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Line Array compacto Meyer LINA",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "JBL",
      modelo: "VTX A12",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Line Array JBL VTX A12",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "JBL",
      modelo: "VTX A8",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Line Array compacto JBL VTX A8",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Martin Audio",
      modelo: "MLA",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Martin Audio MLA",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Martin Audio",
      modelo: "WPC",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Martin Audio WPC",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Martin Audio",
      modelo: "WPS",
      tags: ["pa", "linearray", "install"],
      phantom: null,
      notas: "Martin Audio WPS",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Nexo",
      modelo: "STM",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "NEXO STM modular",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Adamson",
      modelo: "E15",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Adamson E-Series E15",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Adamson",
      modelo: "S10",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "Adamson S-Series S10",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Adamson",
      modelo: "S7",
      tags: ["pa", "linearray", "install"],
      phantom: null,
      notas: "Adamson S-Series S7",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "RCF",
      modelo: "HDL 30-A",
      tags: ["pa", "linearray", "popular"],
      phantom: null,
      notas: "RCF HDL 30-A",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "RCF",
      modelo: "HDL 28-A",
      tags: ["pa", "linearray", "popular"],
      phantom: null,
      notas: "RCF HDL 28-A",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "dBTechnologies",
      modelo: "VIO L212",
      tags: ["pa", "linearray", "touring"],
      phantom: null,
      notas: "dBTechnologies VIO L212",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "dBTechnologies",
      modelo: "VIO L208",
      tags: ["pa", "linearray", "popular"],
      phantom: null,
      notas: "dBTechnologies VIO L208",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Electro-Voice",
      modelo: "X2",
      tags: ["pa", "linearray", "advance"],
      phantom: null,
      notas: "EV X-Line Advance X2",
      isPro: true
    },
    {
      categoria: "pa",
      marca: "Electro-Voice",
      modelo: "X1",
      tags: ["pa", "linearray", "advance"],
      phantom: null,
      notas: "EV X-Line Advance X1",
      isPro: true
    },

    // PA SYSTEMS (FREE)
    {
      categoria: "pa",
      marca: "JBL",
      modelo: "SRX835P",
      tags: ["pa", "linearray", "free"],
      phantom: null,
      notas: "Line Array JBL SRX835P",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "Yamaha",
      modelo: "DXR",
      tags: ["pa", "linearray", "free"],
      phantom: null,
      notas: "Line Array Yamaha DXR",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "Bose",
      modelo: "F1",
      tags: ["pa", "linearray", "free"],
      phantom: null,
      notas: "Line Array Bose F1",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "JBL",
      modelo: "VRX932LA",
      tags: ["pa", "linearray", "popular"],
      phantom: null,
      notas: "JBL VRX932LA",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "RCF",
      modelo: "HDL 20-A",
      tags: ["pa", "linearray", "popular"],
      phantom: null,
      notas: "RCF HDL 20-A",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "RCF",
      modelo: "HDL 10-A",
      tags: ["pa", "linearray", "popular"],
      phantom: null,
      notas: "RCF HDL 10-A",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "Martin Audio",
      modelo: "W8LM",
      tags: ["pa", "linearray", "legacy"],
      phantom: null,
      notas: "Martin Audio W8LM",
      isPro: false
    },
    {
      categoria: "pa",
      marca: "Nexo",
      modelo: "GEO S12",
      tags: ["pa", "linearray", "legacy"],
      phantom: null,
      notas: "NEXO GEO S12",
      isPro: false
    },

    // STANDS (PRO)
    {
      categoria: "stand",
      marca: "K&M",
      modelo: "210",
      tags: ["stand", "profissional"],
      phantom: null,
      notas: "Stand profissional",
      isPro: true
    },
    {
      categoria: "stand",
      marca: "K&M",
      modelo: "259",
      tags: ["stand", "profissional"],
      phantom: null,
      notas: "Stand profissional",
      isPro: true
    },
    {
      categoria: "stand",
      marca: "Hercules",
      modelo: "Stand Profissional",
      tags: ["stand", "profissional"],
      phantom: null,
      notas: "Stand profissional",
      isPro: true
    }
  ],

  // BIBLIOTECA ADICIONAL FREE
  ADDITIONAL_FREE: [
    {
      categoria: "pa",
      marca: "Electro-Voice",
      modelo: "X2",
      tags: ["pa", "linearray"],
      phantom: null,
      notas: "Line Array EV X2",
      isPro: false
    },
    // Adicionando equipamentos Free para marcas especializadas
    {
      categoria: "fx",
      marca: "Bricasti",
      modelo: "M7",
      tags: ["reverb", "fx"],
      phantom: null,
      notas: "Reverb Bricasti M7",
      isPro: false
    },
    {
      categoria: "fx",
      marca: "Lexicon",
      modelo: "PCM",
      tags: ["reverb", "delay", "fx"],
      phantom: null,
      notas: "Reverb/Delay Lexicon PCM",
      isPro: false
    },
    {
      categoria: "fx",
      marca: "TC Electronic",
      modelo: "M3000",
      tags: ["reverb", "fx"],
      phantom: null,
      notas: "Reverb TC Electronic M3000",
      isPro: false
    },
    {
      categoria: "fx",
      marca: "Eventide",
      modelo: "H9",
      tags: ["fx"],
      phantom: null,
      notas: "Processador de efeitos Eventide H9",
      isPro: false
    },
    {
      categoria: "stand",
      marca: "K&M",
      modelo: "210",
      tags: ["stand"],
      phantom: null,
      notas: "Stand K&M 210",
      isPro: false
    },
    {
      categoria: "stand",
      marca: "Hercules",
      modelo: "Stand Profissional",
      tags: ["stand"],
      phantom: null,
      notas: "Stand profissional Hercules",
      isPro: false
    }
  ]
}

// Funções utilitárias
// Remover duplicados por (categoria, marca, modelo). Mantém o último item (priorizando PRO quando presente no final).
const dedupeEquipment = (items) => {
  const map = new Map()
  items.forEach((item) => {
    const key = `${item.categoria}::${item.marca}::${item.modelo}`
    map.set(key, item)
  })
  return Array.from(map.values())
}

export const getEquipmentByCategory = (category, isPro = false) => {
  const freeItems = EQUIPMENT_LIBRARY.FREE.filter(item => item.categoria === category)
  const additionalFreeItems = EQUIPMENT_LIBRARY.ADDITIONAL_FREE.filter(item => item.categoria === category)
  const proItems = isPro ? EQUIPMENT_LIBRARY.PRO.filter(item => item.categoria === category) : []
  return dedupeEquipment([...freeItems, ...additionalFreeItems, ...proItems])
}

export const getAllEquipment = (isPro = false) => {
  const freeItems = EQUIPMENT_LIBRARY.FREE
  const additionalFreeItems = EQUIPMENT_LIBRARY.ADDITIONAL_FREE
  const proItems = isPro ? EQUIPMENT_LIBRARY.PRO : []
  return dedupeEquipment([...freeItems, ...additionalFreeItems, ...proItems])
}

export const getBrands = (isPro = false) => {
  const equipment = getAllEquipment(isPro)
  const brands = [...new Set(equipment.map(item => item.marca))]
  return brands.sort()
}

export const getEquipmentByBrand = (brand, isPro = false) => {
  return getAllEquipment(isPro).filter(item => item.marca === brand)
}

export const searchEquipment = (query, isPro = false) => {
  const equipment = getAllEquipment(isPro)
  const lowerQuery = query.toLowerCase()
  
  return equipment.filter(item => 
    item.marca.toLowerCase().includes(lowerQuery) ||
    item.modelo.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

// Ícones por categoria
export const CATEGORY_ICONS = {
  mic: "🎤",
  di: "🎛️",
  console: "🎚️",
  iem: "🎧",
  wireless: "🎙️",
  fx: "🗂️",
  stand: "🦾",
  sistema: "🔊",
  sidefill: "🔊",
  wedge: "🔊",
  pa: "🔊",
  processor: "⚙️",
  amp: "🔌"
}

// Opções de Stand
export const STAND_OPTIONS = [
  { value: "clamp", label: "Clamp" },
  { value: "ground", label: "Chão/Tripé" },
  { value: "short", label: "Short" },
  { value: "tall", label: "Tall" },
  { value: "boom", label: "Boom" },
  { value: "clip", label: "Clip" }
]
