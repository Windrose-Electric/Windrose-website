/* Windrose chatbot */
(function() {
  var convHistory = [];
  var open = false;

  // Inject related-link styles once
  (function() {
    var s = document.createElement('style');
    s.textContent = '.wr-related{font-size:0.82rem!important;padding:0.5rem 0.75rem!important;background:rgba(0,30,80,0.35)!important;border:none!important;border-left:3px solid rgba(74,158,255,0.7)!important;border-radius:0 6px 6px 0!important;max-width:85%!important;align-self:flex-start!important;}.wr-related-lbl{display:block!important;font-size:0.68rem!important;letter-spacing:0.1em!important;text-transform:uppercase!important;color:rgba(140,180,255,0.5)!important;margin-bottom:0.4rem!important;font-family:Barlow Condensed,sans-serif!important;}.wr-related a{color:#90c8ff!important;text-decoration:none!important;display:block!important;padding:0.22rem 0!important;line-height:1.4!important;border-top:1px solid rgba(74,158,255,0.12)!important;}.wr-related a:first-of-type{border-top:none!important;}.wr-related a:hover{color:#c8e8ff!important;text-decoration:underline!important;}';
    document.head.appendChild(s);
  })();

  // Curated keyword search index for related-link feature
  var SEARCH_INDEX = [
    // Buying & pricing
    { t: 'How to Buy — Pricing & Ordering', u: '/how-to-buy.html', k: ['price', 'cost', 'buy', 'order', 'purchase', 'reserv', 'deposit', 'payment', 'lease', 'finance', 'fund', 'grant', 'hvip', 'subsid', 'incentiv'] },
    { t: 'European Pricing & Grant Info', u: '/how-to-buy.html#eu-price', k: ['eur', 'europe', '€', 'euro', 'eu grant', 'eu subsid'] },
    { t: 'US Pricing & HVIP', u: '/how-to-buy.html#us-price', k: ['usd', 'usa', 'us price', 'america', 'hvip', '$285', '$285,000', 'carb', 'california'] },
    { t: 'UK Pricing & ZEV Grant', u: '/how-to-buy.html#uk-price', k: ['uk', 'britain', 'gbp', '£', 'zev grant', 'united kingdom', 'british'] },
    { t: 'Australia Pricing', u: '/how-to-buy.html#au-price', k: ['australia', 'aud', 'a$', 'adr'] },
    // Charging
    { t: 'How to Charge Your E700', u: '/how-to-use.html#charging', k: ['charg', 'plug', 'mcs', 'ccs', 'ccs1', 'ccs2', 'connector', 'charge time', 'charg speed', 'megawatt', '870', 'kw', 'outlet', 'station'] },
    { t: 'Charging Partners & Networks', u: '/technology.html#charging-partners', k: ['milence', 'kempower', 'ev realty', 'greenlane', 'terawatt', 'hubject', 'sinexcel', 'partner', 'network', 'charg point', 'charg station'] },
    { t: 'Plug & Charge (ISO 15118)', u: '/technology.html#charging-partners', k: ['plug and charge', 'plug&charge', 'iso 15118', 'autocharge', 'no card', 'no app'] },
    { t: 'Owner\'s Manual — Charging Port & Procedure', u: '/owners-manual-us/#charging-port', k: ['charg port', 'charg procedure', 'how to charge', 'charg step'] },
    // Range & performance
    { t: 'Range & Performance — Technology', u: '/technology.html#range', k: ['range', 'km', 'mile', '700', '500', 'distance', 'endurance', 'how far', 'range drop', 'range cold', 'payload'] },
    { t: 'Battery & Motor Specs', u: '/technology.html#specs', k: ['battery', 'kwh', '705', 'lfp', 'motor', 'hp', 'horsepower', '1400', 'torque', 'kw', '1045', '800v', 'voltage'] },
    { t: 'Owner\'s Manual — Technical Specs', u: '/owners-manual-us/#curb-weight-gvw-axle-load-drive-mode', k: ['weight', 'dimension', 'gcw', 'gvw', 'axle', 'curb weight', 'length', 'width', 'height', 'technical data', 'spec'] },
    // Driving & operation
    { t: 'How to Use Your E700 — Driving Guide', u: '/how-to-use.html', k: ['how to driv', 'driv guide', 'how to start', 'how to stop', 'how to use', 'operat'] },
    { t: 'Owner\'s Manual — Power ON/OFF & Starting', u: '/owners-manual-us/#power-on-off', k: ['start', 'power on', 'power off', 'turn on', 'turn off', 'nfc', 'key card', 'ignition', 'boot'] },
    { t: 'Owner\'s Manual — Driving Controls & Gear', u: '/owners-manual-us/#gear-selector', k: ['gear', 'drive mode', 'park', 'reverse', 'neutral', 'forward', 'd mode', 'r mode', 'p mode'] },
    { t: 'Owner\'s Manual — Regenerative Braking', u: '/owners-manual-us/#regenerative-braking', k: ['regen', 'regenerat', 'kers', 'kinetic', 'paddle', 'recuperat', 'energy recovery'] },
    { t: 'Owner\'s Manual — Eco Driving Tips', u: '/owners-manual-us/#eco-driving', k: ['eco', 'efficien', 'save energy', 'maximize range', 'tip', 'fuel sav'] },
    // ADAS & safety
    { t: 'ADAS & Driver Assistance — Technology', u: '/technology.html#adas', k: ['adas', 'driver assist', 'safety feature', 'autonomous', 'level 2', 'semi-auto'] },
    { t: 'Owner\'s Manual — Adaptive Cruise Control', u: '/owners-manual-us/#adaptive-cruise-control-acc', k: ['acc', 'adaptive cruise', 'cruise control', 'auto speed'] },
    { t: 'Owner\'s Manual — Lane Departure Warning', u: '/owners-manual-us/#lane-departure-warning-ldw', k: ['lane', 'ldw', 'lane keep', 'lane depart', 'lane warning'] },
    { t: 'Owner\'s Manual — Auto Emergency Braking (AEB)', u: '/owners-manual-us/#auto-emergency-braking', k: ['aeb', 'auto brake', 'emergency brake', 'collision', 'fcw', 'forward collision'] },
    { t: 'Owner\'s Manual — Around View Monitor', u: '/owners-manual-us/#around-view-monitor-avm', k: ['avm', 'around view', 'surround', 'camera', '360', 'bird eye', 'parking camera'] },
    { t: 'Owner\'s Manual — Blind Spot Monitoring', u: '/owners-manual-us/#blind-spot', k: ['blind spot', 'bsd', 'side assist', 'lane change assist'] },
    // Maintenance & service
    { t: 'How to Service Your E700', u: '/how-to-service.html', k: ['service', 'mainten', 'repair', 'workshop', 'service center', 'scheduled mainten', 'annual', 'inspect'] },
    { t: 'Owner\'s Manual — Maintenance Schedule', u: '/owners-manual-us/#maintenance-schedule', k: ['mainten schedule', 'service interval', 'when to service', '10,000', '20,000', 'km interval'] },
    { t: 'Owner\'s Manual — Coolant', u: '/owners-manual-us/#coolant', k: ['coolant', 'antifreeze', 'fluid', 'radiator', 'overheat', 'temp'] },
    { t: 'Owner\'s Manual — Tire Pressure (TPMS)', u: '/owners-manual-us/#tire-pressure-monitoring', k: ['tire', 'tyre', 'tpms', 'pressure', 'flat', 'puncture', 'psi', 'inflation'] },
    // Emergency
    { t: 'Owner\'s Manual — Emergency Procedures', u: '/owners-manual-us/#vehicle-recovery-and-towing', k: ['emergency', 'breakdown', 'tow', 'stuck', 'recover', 'call', 'help'] },
    { t: 'Owner\'s Manual — Vehicle Fire', u: '/owners-manual-us/#rescue-of-vehicle-on-fire', k: ['fire', 'smoke', 'burn', 'extinguish', 'evacuate', 'hazard'] },
    // Company & ordering
    { t: 'About Windrose Electric', u: '/about-us.html', k: ['about', 'company', 'founded', 'headquarter', 'team', 'investor', 'mission', 'history', 'founder', 'wen han', 'antwerp', 'belgium'] },
    { t: 'Technology Overview', u: '/technology.html', k: ['technolog', 'innovation', 'design', 'engineer', 'how it work', 'platform', 'architecture'] },
    { t: 'Certifications & Markets', u: '/technology.html#certifications', k: ['certif', 'approv', 'regulation', 'fmvss', 'wvta', 'adr', 'nzta', 'homolog', 'compliance', 'market'] },
    { t: 'IPO / Investor Relations', u: '/about-us.html#ipo', k: ['ipo', 'stock', 'share', 'invest', 'nyse', 'wdrs', 's-1', 'sec', 'public', 'equity'] },
    // Warranties & delivery
    { t: 'Delivery Timeline', u: '/how-to-buy.html#delivery', k: ['deliver', 'when', 'q3 2026', 'q4 2026', 'lead time', 'wait', 'ship', 'arrival'] },
    { t: 'Winter & Special Conditions Driving', u: '/owners-manual-us/#winter-driving', k: ['winter', 'cold', 'snow', 'ice', 'freeze', 'chain', 'low temp', 'artic'] },
    // Owner's Manual — Section 1: Safety & Compliance
    { t: 'Owner\'s Manual — Notes to Users', u: '/owners-manual-us/#notes-to-users', k: ['note', 'symbol', 'icon', 'warning symbol', 'manual guide', 'how to read'] },
    { t: 'Owner\'s Manual — Warning Descriptions', u: '/owners-manual-us/#warning-description', k: ['danger', 'warning', 'caution', 'notice', 'asterisk', 'illustration'] },
    { t: 'Owner\'s Manual — Environmental Protection', u: '/owners-manual-us/#environmental-protection-1', k: ['environment', 'recycl', 'disposal', 'green', 'sustainab', 'ecology'] },
    { t: 'Owner\'s Manual — Operating Safety', u: '/owners-manual-us/#operation-safety-and-permit', k: ['operat safety', 'permit', 'safe operat', 'license', 'authoriz', 'approval'] },
    { t: 'Owner\'s Manual — Genuine Parts', u: '/owners-manual-us/#original-parts', k: ['genuine', 'original part', 'spare part', 'oem', 'replacement part', 'aftermarket'] },
    { t: 'Owner\'s Manual — Data Security', u: '/owners-manual-us/#data-security', k: ['data', 'privacy', 'security', 'personal data', 'gdpr', 'data protect'] },
    { t: 'Owner\'s Manual — Vehicle Modification', u: '/owners-manual-us/#vehicle-modification', k: ['modif', 'custom', 'upfit', 'alter', 'retrofit', 'convert', 'accessory'] },
    { t: 'Owner\'s Manual — Vehicle Scrapping', u: '/owners-manual-us/#vehicle-scrapping', k: ['scrap', 'end of life', 'dismantl', 'decommission', 'retire', 'battery recycl'] },
    { t: 'Owner\'s Manual — Use of Snow Chains', u: '/owners-manual-us/#use-of-snow-chains', k: ['snow chain', 'chain', 'winter traction', 'anti-skid', 'traction aid'] },
    { t: 'Owner\'s Manual — Driving in Hot/Tropical Conditions', u: '/owners-manual-us/#driving-in-tropical-and-high-temperature-areas', k: ['hot', 'tropical', 'heat', 'high temp', 'summer driving', 'overh'] },
    { t: 'Owner\'s Manual — Ramp Driving', u: '/owners-manual-us/#ramp-driving', k: ['ramp', 'hill', 'slope', 'incline', 'uphill', 'downhill', 'gradient', 'grade'] },
    { t: 'Owner\'s Manual — Reporting Safety Defects', u: '/owners-manual-us/#reporting-safety-defects', k: ['defect', 'recall', 'report fault', 'safety report', 'nhtsa', 'vosa', 'complaint'] },
    // Owner's Manual — Section 2: Vehicle Overview
    { t: 'Owner\'s Manual — Vehicle Exterior Overview', u: '/owners-manual-us/#overview-of-vehicle-exterior', k: ['exterior', 'outside', 'body', 'cab', 'hood', 'front', 'rear', 'side panel', 'mirror'] },
    { t: 'Owner\'s Manual — Vehicle Interior Overview', u: '/owners-manual-us/#overview-of-vehicle-interior', k: ['interior', 'inside', 'cockpit', 'dashboard', 'console', 'cabin layout'] },
    { t: 'Owner\'s Manual — Vehicle Nameplate & VIN', u: '/owners-manual-us/#vehicle-nameplate-and-vin', k: ['vin', 'chassis number', 'serial number', 'nameplate', 'vehicle id', 'plate'] },
    { t: 'Owner\'s Manual — Motor Nameplate Location', u: '/owners-manual-us/#location-of-motor-nameplate-and-code', k: ['motor code', 'motor nameplate', 'motor serial', 'motor id', 'drive unit'] },
    // Owner's Manual — Section 3: Interior & Comfort
    { t: 'Owner\'s Manual — Electric Sliding Door', u: '/owners-manual-us/#electric-sliding-door', k: ['sliding door', 'side door', 'passenger door', 'door open', 'door close', 'electric door'] },
    { t: 'Owner\'s Manual — Seat Belt', u: '/owners-manual-us/#seat-belt', k: ['seat belt', 'seatbelt', 'belt', 'buckle', 'harness', 'restraint'] },
    { t: 'Owner\'s Manual — Power Window', u: '/owners-manual-us/#power-window', k: ['window', 'power window', 'window open', 'window close', 'window switch'] },
    { t: 'Owner\'s Manual — Sleeper Privacy Curtain', u: '/owners-manual-us/#sleeper-privacy-curtain', k: ['curtain', 'privacy', 'sleeper curtain', 'bunk curtain', 'blackout'] },
    { t: 'Owner\'s Manual — Panoramic Sunroof', u: '/owners-manual-us/#panoramic-sunroof', k: ['sunroof', 'panoramic', 'glass roof', 'roof window', 'skylight'] },
    { t: 'Owner\'s Manual — Windshield Electric Sunshade', u: '/owners-manual-us/#windshield-electric-sunshade', k: ['sunshade', 'windshield shade', 'sun visor', 'electric shade', 'glare'] },
    { t: 'Owner\'s Manual — Interior Sleeper', u: '/owners-manual-us/#interior-sleeper', k: ['sleeper', 'bunk', 'bed', 'rest area', 'sleep', 'overnight'] },
    { t: 'Owner\'s Manual — Rearview Mirror', u: '/owners-manual-us/#rearview-mirror', k: ['rearview', 'mirror', 'rear mirror', 'side mirror', 'wing mirror', 'adjust mirror'] },
    { t: 'Owner\'s Manual — Cup Holder', u: '/owners-manual-us/#cup-holder', k: ['cup', 'drink holder', 'bottle holder', 'beverage', 'cup holder'] },
    { t: 'Owner\'s Manual — Ash Tray', u: '/owners-manual-us/#ash-tray', k: ['ash tray', 'ashtray', 'smoking', 'cigarette', 'ash'] },
    { t: 'Owner\'s Manual — Side Toolbox', u: '/owners-manual-us/#side-toolbox', k: ['toolbox', 'tool box', 'tool storage', 'compartment', 'storage box'] },
    { t: 'Owner\'s Manual — Interior Storage', u: '/owners-manual-us/#interior-storage-device', k: ['storage', 'glove box', 'cubby', 'drawer', 'organizer', 'cargo space'] },
    { t: 'Owner\'s Manual — Net Bag', u: '/owners-manual-us/#net-bag', k: ['net bag', 'mesh bag', 'cargo net', 'net storage'] },
    { t: 'Owner\'s Manual — Newspapers & Periodicals Rack', u: '/owners-manual-us/#newspapers-and-periodicals-device', k: ['newspaper', 'magazine', 'document rack', 'periodical', 'reading rack'] },
    { t: 'Owner\'s Manual — Coat Hook', u: '/owners-manual-us/#coat-hook', k: ['coat hook', 'hanger', 'hook', 'jacket', 'hang coat'] },
    { t: 'Owner\'s Manual — Hanging Device', u: '/owners-manual-us/#hanging-device', k: ['hanging', 'hang device', 'hook device', 'overhead hook'] },
    { t: 'Owner\'s Manual — USB Charging', u: '/owners-manual-us/#usb-charging', k: ['usb', 'usb charge', 'phone charge', 'device charge', 'usb port', 'usb-a', 'usb-c'] },
    { t: 'Owner\'s Manual — Wireless Phone Charging', u: '/owners-manual-us/#phone-wireless-charging', k: ['wireless charg', 'qi charg', 'inductive charg', 'wireless phone', 'pad charg'] },
    { t: 'Owner\'s Manual — Power Outlet', u: '/owners-manual-us/#power-outlet', k: ['power outlet', '230v', '110v', 'socket', 'inverter', 'ac outlet', 'plug in'] },
    { t: 'Owner\'s Manual — Ceiling Lamp', u: '/owners-manual-us/#ceiling-lamp', k: ['ceiling lamp', 'dome light', 'overhead light', 'interior light', 'roof lamp'] },
    { t: 'Owner\'s Manual — Courtesy Lamp', u: '/owners-manual-us/#courtesy-lamp', k: ['courtesy lamp', 'step light', 'entry light', 'door lamp', 'welcome light'] },
    { t: 'Owner\'s Manual — Reading Lamp', u: '/owners-manual-us/#reading-lamp', k: ['reading lamp', 'reading light', 'task light', 'desk lamp', 'bunk light'] },
    { t: 'Owner\'s Manual — Ambient Lamp', u: '/owners-manual-us/#ambient-lamp', k: ['ambient', 'mood light', 'accent light', 'led strip', 'interior ambiance'] },
    { t: 'Owner\'s Manual — A/C Control System', u: '/owners-manual-us/#ac-control-system', k: ['air condition', 'a/c', 'hvac', 'climate control', 'heat', 'cool', 'fan', 'ventilat'] },
    { t: 'Owner\'s Manual — A/C Vent Adjustment', u: '/owners-manual-us/#ac-vent-adjustment', k: ['vent', 'airflow', 'louver', 'air direction', 'duct', 'grille'] },
    { t: 'Owner\'s Manual — In-Vehicle Fragrance', u: '/owners-manual-us/#in-vehicle-fragrance', k: ['fragrance', 'scent', 'air freshener', 'odor', 'perfume', 'aroma'] },
    // Owner's Manual — Section 4: Charging & Pre-drive
    { t: 'Owner\'s Manual — Charging Preparation', u: '/owners-manual-us/#charging-preparation', k: ['charg prep', 'before charg', 'charg setup', 'charg check', 'pre-charg'] },
    { t: 'Owner\'s Manual — Driving Preparation', u: '/owners-manual-us/#driving-preparation', k: ['pre-drive', 'before driv', 'driv check', 'pre-trip', 'departure check', 'walkaround'] },
    { t: 'Owner\'s Manual — Driver Seat Adjustment', u: '/owners-manual-us/#driver-seat', k: ['driver seat', 'seat adjust', 'seat position', 'lumbar', 'seat height', 'seat forward'] },
    { t: 'Owner\'s Manual — Front Passenger Seat', u: '/owners-manual-us/#front-passenger-seat', k: ['passenger seat', 'co-driver seat', 'front seat', 'instructor seat'] },
    { t: 'Owner\'s Manual — NFC Card', u: '/owners-manual-us/#nfc-card', k: ['nfc', 'key card', 'rfid', 'smart card', 'access card', 'tap card'] },
    { t: 'Owner\'s Manual — Mechanical Key', u: '/owners-manual-us/#mechanical-key', k: ['mechanical key', 'physical key', 'backup key', 'manual key', 'key fob'] },
    { t: 'Owner\'s Manual — Steering Wheel Adjustment', u: '/owners-manual-us/#adjustment-of-steering-wheel', k: ['steering wheel adjust', 'tilt', 'telescope', 'wheel position', 'column adjust'] },
    { t: 'Owner\'s Manual — Steering Wheel Buttons', u: '/owners-manual-us/#buttons-on-steering-wheel', k: ['steering wheel button', 'horn', 'cruise button', 'multifunction', 'wheel control'] },
    // Owner's Manual — Section 5: Instrument Cluster
    { t: 'Owner\'s Manual — Instrument Cluster Overview', u: '/owners-manual-us/#overview-of-instrument-cluster', k: ['instrument cluster', 'dashboard display', 'gauge', 'speedometer', 'odometer', 'cluster'] },
    { t: 'Owner\'s Manual — Indicators & Warning Lamps', u: '/owners-manual-us/#indicators-and-warning-lamps', k: ['warning lamp', 'indicator', 'check light', 'fault light', 'malfunction', 'warning light', 'symbol mean'] },
    // Owner's Manual — Section 6: Driving Controls
    { t: 'Owner\'s Manual — Wiper Control', u: '/owners-manual-us/#wiper-control', k: ['wiper', 'windshield wiper', 'rain wiper', 'washer', 'wiper speed', 'intermittent'] },
    { t: 'Owner\'s Manual — Light Switch', u: '/owners-manual-us/#light-switch', k: ['headlight', 'light switch', 'daytime running', 'drl', 'low beam', 'high beam', 'fog light'] },
    { t: 'Owner\'s Manual — Hazard Warning Lamp', u: '/owners-manual-us/#hazard-warning-lamp-switch', k: ['hazard', 'flasher', 'emergency light', 'four-way', '4-way flash', 'triangle button'] },
    { t: 'Owner\'s Manual — Gear & Shift Operation', u: '/owners-manual-us/#shift-operation', k: ['gear', 'shift', 'drive', 'reverse', 'neutral', 'park', 'selector', 'd r n p'] },
    { t: 'Owner\'s Manual — Service Brake', u: '/owners-manual-us/#service-brake', k: ['brake', 'foot brake', 'brake pedal', 'brake force', 'abs', 'brake system'] },
    { t: 'Owner\'s Manual — Electronic Parking Brake (EPB)', u: '/owners-manual-us/#electronic-parking-brake-epb', k: ['parking brake', 'epb', 'handbrake', 'e-brake', 'auto hold', 'park brake'] },
    { t: 'Owner\'s Manual — Emergency Braking Procedure', u: '/owners-manual-us/#emergency-braking---driving', k: ['emergency brake', 'panic stop', 'full brake', 'stop fast', 'hard brake'] },
    { t: 'Owner\'s Manual — AR-HUD', u: '/owners-manual-us/#ar-hud', k: ['ar hud', 'head up display', 'hud', 'augmented reality', 'windshield display', 'projection'] },
    { t: 'Owner\'s Manual — Differential Lock', u: '/owners-manual-us/#differential-lock', k: ['diff lock', 'differential', 'traction', 'axle lock', 'awd', '4wd', 'off-road'] },
    { t: 'Owner\'s Manual — Driving Mode Selection', u: '/owners-manual-us/#driving-mode', k: ['drive mode', 'eco mode', 'sport mode', 'normal mode', 'boost', 'mode select'] },
    // Owner's Manual — Section 7: Driver Assistance
    { t: 'Owner\'s Manual — Moving Off Information System (MOIS)', u: '/owners-manual-us/#moving-off-information-system-mois', k: ['moving off', 'mois', 'pull away', 'start assist', 'departure warn'] },
    { t: 'Owner\'s Manual — Low Speed Alarm & Reverse', u: '/owners-manual-us/#low-speed-alarm-and-reverse', k: ['low speed', 'reverse alarm', 'backup alarm', 'reversing beep', 'reverse warn', 'pedestrian warn'] },
    { t: 'Owner\'s Manual — Electronic Braking System (EBS)', u: '/owners-manual-us/#electronic-braking-system-ebs', k: ['ebs', 'electronic braking', 'trailer brake', 'air brake', 'brake control'] },
    { t: 'Owner\'s Manual — Electronic Brakeforce Distribution (EBD)', u: '/owners-manual-us/#electronic-brakeforce-distribution-ebd', k: ['ebd', 'brake distribution', 'brakeforce', 'brake balance', 'front rear brake'] },
    { t: 'Owner\'s Manual — Acceleration Slip Regulation (ASR)', u: '/owners-manual-us/#acceleration-slip-regulation-asr', k: ['asr', 'traction control', 'slip control', 'wheel spin', 'acceleration slip'] },
    { t: 'Owner\'s Manual — Electronic Stability Control (ESC)', u: '/owners-manual-us/#electronic-stability-control-esc', k: ['esc', 'stability control', 'vsc', 'yaw control', 'skid control', 'electronic stability'] },
    { t: 'Owner\'s Manual — ADDW', u: '/owners-manual-us/#addw', k: ['addw', 'driver drowsy', 'driver attention', 'fatigue', 'drowsiness', 'alert'] },
    { t: 'Owner\'s Manual — Intelligent Speed Assistance (ISA)', u: '/owners-manual-us/#intelligent-speed-assistance-isa', k: ['isa', 'speed assist', 'speed limit', 'speed warning', 'intelligent speed', 'speed camera'] },
    { t: 'Owner\'s Manual — Hill Start Assist (HSA)', u: '/owners-manual-us/#hill-start-assist-hsa', k: ['hsa', 'hill start', 'hill hold', 'hill assist', 'rollback prevent', 'slope start'] },
    { t: 'Owner\'s Manual — Tire Emergency Safety Device (TESD)', u: '/owners-manual-us/#steering-wheel-tire-emergency-safety-device-tesd', k: ['tesd', 'tire emergency', 'blowout control', 'tire safety device', 'run-flat'] },
    { t: 'Owner\'s Manual — Electro-Hydraulic Power Steering (EHPS)', u: '/owners-manual-us/#electro-hydraulic-power-steering-ehps', k: ['ehps', 'power steering', 'steering assist', 'hydraulic steering', 'eps', 'steering effort'] },
    { t: 'Owner\'s Manual — Electronic Air Suspension (ECAS)', u: '/owners-manual-us/#electronic-controlled-air-suspension-ecas', k: ['ecas', 'air suspension', 'air bag', 'ride height', 'suspension adjust', 'leveling'] },
    { t: 'Owner\'s Manual — TPMS System', u: '/owners-manual-us/#tire-pressure-monitoring-system-tpms', k: ['tpms', 'tire pressure system', 'pressure sensor', 'low pressure warn', 'tire monitor'] },
    { t: 'Owner\'s Manual — Multimedia System', u: '/owners-manual-us/#multimedia-overview', k: ['multimedia', 'infotainment', 'touchscreen', 'display', 'radio', 'navigation', 'bluetooth', 'connect'] },
    { t: 'Owner\'s Manual — Driver\'s Tools', u: '/owners-manual-us/#drivers-tools', k: ['driver tool', 'on-board tool', 'wheel wrench', 'jack', 'toolkit', 'emergency kit'] },
    // Owner's Manual — Section 8: Emergency Procedures
    { t: 'Owner\'s Manual — Safety Hammer', u: '/owners-manual-us/#safety-hammer', k: ['safety hammer', 'glass breaker', 'escape hammer', 'window break', 'emergency exit'] },
    { t: 'Owner\'s Manual — Fire Extinguisher', u: '/owners-manual-us/#fire-extinguisher', k: ['fire extinguisher', 'extinguish', 'fire suppression', 'foam', 'co2', 'fire fight'] },
    { t: 'Owner\'s Manual — Towing a Trailer', u: '/owners-manual-us/#towing-trailer', k: ['trailer', 'tow', 'coupling', 'fifth wheel', 'pin', 'semi-trailer', 'hitch', 'kingpin'] },
    { t: 'Owner\'s Manual — Brake Failure', u: '/owners-manual-us/#brake-failure', k: ['brake fail', 'brake loss', 'no brake', 'brake fade', 'brake warning', 'runaway'] },
    { t: 'Owner\'s Manual — Steering Failure', u: '/owners-manual-us/#out-of-control-steering-or-steering-failure', k: ['steering fail', 'lose control', 'out of control', 'steering loss', 'jackknife'] },
    { t: 'Owner\'s Manual — Tire Burst', u: '/owners-manual-us/#tire-burst', k: ['tire burst', 'blowout', 'flat tire', 'puncture', 'tyre burst', 'blow out'] },
    { t: 'Owner\'s Manual — Vehicle Sideslip', u: '/owners-manual-us/#vehicle-sideslip', k: ['sideslip', 'skid', 'slide', 'loss of traction', 'aquaplan', 'fishtail'] },
    { t: 'Owner\'s Manual — High Voltage Accidental Removal', u: '/owners-manual-us/#accidental-removal-of-high-voltage', k: ['high voltage accident', 'hv disconnect', 'cable pull', 'voltage exposure', 'electric shock'] },
    { t: 'Owner\'s Manual — Emergency Evacuation', u: '/owners-manual-us/#emergency-evacuation', k: ['evacuat', 'escape', 'exit vehicle', 'emergency exit', 'abandon', 'get out'] },
    { t: 'Owner\'s Manual — Emergency Rescue Equipment', u: '/owners-manual-us/#protective-equipment-for-emergency-rescue-personnel', k: ['rescue equipment', 'protective gear', 'ppe', 'glove', 'first responder', 'rescuer'] },
    { t: 'Owner\'s Manual — High-Voltage System Information', u: '/owners-manual-us/#high-voltage-system-information', k: ['high voltage', 'hv system', 'hv info', 'orange cable', 'electric hazard', 'hv warning'] },
    { t: 'Owner\'s Manual — HV System Deactivation', u: '/owners-manual-us/#deactivation-method-of-high-voltage-system', k: ['deactivat', 'hv off', 'disable hv', 'isolat', 'cut power', 'service disconnect'] },
    { t: 'Owner\'s Manual — Rescue of Wading Vehicle', u: '/owners-manual-us/#rescue-of-wading-vehicle', k: ['wading', 'flood', 'water', 'submerge', 'stuck in water', 'deep water'] },
    // Owner's Manual — Section 9: Maintenance
    { t: 'Owner\'s Manual — Maintenance Overview', u: '/owners-manual-us/#necessity-of-maintenance', k: ['mainten overview', 'why service', 'preventive mainten', 'service necessity', 'upkeep'] },
    { t: 'Owner\'s Manual — Service Mode', u: '/owners-manual-us/#service-mode', k: ['service mode', 'mainten mode', 'workshop mode', 'tech mode', 'diagnostic mode'] },
    { t: 'Owner\'s Manual — Electric Drive System Inspection', u: '/owners-manual-us/#inspection-of-electric-drive-system', k: ['electric drive inspect', 'motor inspect', 'powertrain check', 'drive unit inspect', 'axle inspect'] },
    { t: 'Owner\'s Manual — Lighting Inspection', u: '/owners-manual-us/#lighting-inspection', k: ['light inspect', 'bulb check', 'led check', 'headlight check', 'lamp inspect'] },
    { t: 'Owner\'s Manual — Horn & Wiper Inspection', u: '/owners-manual-us/#inspection-of-horns-and-wipers', k: ['horn', 'wiper inspect', 'horn check', 'wiper blade', 'washer fluid'] },
    { t: 'Owner\'s Manual — High-Voltage Battery Maintenance', u: '/owners-manual-us/#high-voltage-battery', k: ['hv battery', 'battery mainten', 'battery health', 'battery inspect', 'battery care'] },
    { t: 'Owner\'s Manual — Tire Maintenance', u: '/owners-manual-us/#tire', k: ['tire mainten', 'tire wear', 'tread depth', 'tire rotat', 'tire replac', 'retread'] },
    { t: 'Owner\'s Manual — Steering System Maintenance', u: '/owners-manual-us/#steering-system', k: ['steering mainten', 'steering fluid', 'steering inspect', 'power steering mainten'] },
    { t: 'Owner\'s Manual — High-Voltage Safety Maintenance', u: '/owners-manual-us/#high-voltage-security-maintenance', k: ['hv safety', 'high voltage mainten', 'hv cable inspect', 'insulation check', 'hv service'] },
    // Owner's Manual — Section 10: Technical Specifications
    { t: 'Owner\'s Manual — Battery Specifications', u: '/owners-manual-us/#battery', k: ['battery spec', 'battery capacit', 'kwh', 'lfp', 'cell', 'pack', 'soc', 'energy storage'] },
    { t: 'Owner\'s Manual — Vehicle Dimensions', u: '/owners-manual-us/#vehicle-outline-size', k: ['dimension', 'length', 'width', 'height', 'wheelbase', 'overhang', 'size', 'footprint'] },
    { t: 'Owner\'s Manual — Power System Parameters', u: '/owners-manual-us/#parameters-of-power-system', k: ['power param', 'motor power', 'peak power', 'continuous power', 'system voltage', 'power spec'] },
    { t: 'Owner\'s Manual — Fastening Torque', u: '/owners-manual-us/#fastening-torque', k: ['torque spec', 'bolt torque', 'tightening', 'nm', 'fastener', 'wrench torque'] },
    { t: 'Owner\'s Manual — Tire Pressure Specifications', u: '/owners-manual-us/#tire-pressure-gauge', k: ['tire pressure spec', 'recommended pressure', 'psi', 'bar', 'kpa', 'inflation spec'] },
    { t: 'Owner\'s Manual — Wheel Alignment Parameters', u: '/owners-manual-us/#wheel-alignment-parameters', k: ['wheel alignment', 'camber', 'caster', 'toe', 'alignment spec', 'steering geometry'] },
    { t: 'Owner\'s Manual — Gradability', u: '/owners-manual-us/#gradability', k: ['gradab', 'grade', 'climb', 'hill climb', 'slope capab', 'max grade', 'incline capab'] },
    { t: 'Owner\'s Manual — Air Reservoir Pressure', u: '/owners-manual-us/#working-pressure-of-air-reservoir', k: ['air reserv', 'air tank', 'air pressure', 'compressor', 'pneumatic', 'air brake pressure'] },
  ];

  function findRelated(q) {
    var ql = q.toLowerCase();
    var scored = SEARCH_INDEX.map(function(e) {
      var score = e.k.reduce(function(s, kw) { return s + (ql.indexOf(kw) >= 0 ? 1 : 0); }, 0);
      return { e: e, s: score };
    }).filter(function(x) { return x.s > 0; }).sort(function(a, b) { return b.s - a.s; });
    return scored.slice(0, 3).map(function(x) { return x.e; });
  }

  function addRelated(q) {
    var results = findRelated(q);
    if (!results.length) return;
    var links = results.map(function(r) { return '<a href="' + r.u + '">→ ' + r.t + '</a>'; }).join('');
    addMsg('<span class="wr-related-lbl">Related pages</span>' + links, 'bot related', true);
  }

  var LANG_NAMES = {
    'en':'English', 'es':'Spanish', 'fr':'French', 'de':'German',
    'zh':'Chinese (Simplified)', 'nl':'Dutch', 'no':'Norwegian',
    'sv':'Swedish', 'fi':'Finnish', 'da':'Danish', 'pl':'Polish',
    'it':'Italian', 'pt':'Portuguese', 'ja':'Japanese', 'ko':'Korean'
  };

  window.FAQ_LANGS = window.FAQ_LANGS || {}; var FAQ_LANGS = {
    'range': {
      'en': '• 700 km fully loaded — single trailer at 49 tons\n• 500 km with double trailer at 64 tons\n• Next generation targets 800+ km',
      'fr': 'Le Windrose E700 atteint 700 km en charge complète (semi-remorque simple, 49 tonnes). Avec un B-double à 64 tonnes : 500 km. La prochaine génération vise 800+ km.',
      'de': 'Der Windrose E700 erreicht 700 km vollbeladen (Einzelauflieger, 49 Tonnen). Mit B-Doppel bei 64 Tonnen: 500 km. Die nächste Generation soll 800+ km erreichen.',
      'zh': 'Windrose E700满载续航700公里(单挂49吨)。双挂64吨时续航500公里。下一代目标800+公里。',
      'nl': 'De Windrose E700 haalt 700 km volledig beladen (enkele trailer, 49 ton). Met B-double bij 64 ton: 500 km. Volgende generatie streeft naar 800+ km.',
      'no': 'Windrose E700 oppnår 700 km fullt lastet (enkelttrailer, 49 tonn). Med B-dobbel ved 64 tonn: 500 km. Neste generasjon sikter på 800+ km.','is':'Windrose E700 nær 700 km fullhlaðinn (einni eftirvagn, 49 tonn). Með tvöfaldri eftirvagn við 64 tonn: 500 km. Næsta kynslóð miðar að 800+ km.',
      'sv': 'Windrose E700 uppnår 700 km fullt lastad (enkeltrailer, 49 ton). Med B-dubbel vid 64 ton: 500 km. Nästa generation siktar på 800+ km.',
      'fi': 'Windrose E700 saavuttaa 700 km täysin kuormattuna (yksiakseli, 49 tonnia). B-kaksoiskonfiguraatiolla 64 tonnilla: 500 km. Seuraava sukupolvi tavoittelee 800+ km.',
      'da': 'Windrose E700 opnår 700 km fuldt lastet (enkelttrailer, 49 ton). Med B-dobbelt ved 64 ton: 500 km. Næste generation sigter mod 800+ km.',
      'pl': 'Windrose E700 osiąga 700 km z pełnym ładunkiem (pojedyncza naczepa, 49 ton). Z B-double przy 64 tonach: 500 km. Kolejna generacja celuje w 800+ km.',
      'it': 'Il Windrose E700 raggiunge 700 km a pieno carico (semirimorchio singolo, 49 tonnellate). Con B-double a 64 tonnellate: 500 km. La prossima generazione punta a 800+ km.',
      'pt': 'O Windrose E700 atinge 700 km totalmente carregado (semirreboque simples, 49 toneladas). Com B-double a 64 toneladas: 500 km. Próxima geração visa 800+ km.',
      'ja': 'Windrose E700は満載 (シングルトレーラー49トン) で700kmの航続距離。ダブルトレーラー64トン時は500km。次世代では800+kmを目標。',
      'ko': 'Windrose E700은 만재(싱글 트레일러, 49톤) 기준 700km를 달성합니다. 64톤 더블 트레일러는 500km. 차세대 목표는 800+km.',
    },
    'price': {
      'en': '• 🇪🇺 €198,000 excl. taxes — lease from €3,900/mo\n• 🇬🇧 £220,000 excl. VAT — up to £81k UK grant — from £2,200/mo after grant\n• 🇺🇸 $285,000 excl. taxes — $120k+ HVIP — from $3,100/mo after HVIP\n• 🇦🇺 A$450,000 excl. GST — from A$7,200/mo\n• Click a price card or email sales@windrose.ai to enquire',
      'fr': 'Prix indicatifs : 🇪🇺 250 000 € · 🇬🇧 220 000 £ (jusqu\'à 81 000 £ de subvention) · 🇺🇸 300 000 $ (120 000 $+ HVIP) · 🇦🇺 450 000 A$. Leasing à partir de 3 900 €/mois.',
      'de': 'Richtpreise: 🇪🇺 €250.000 · 🇬🇧 £220.000 (bis zu £81.000 Förderung) · 🇺🇸 $300.000 ($120.000+ HVIP) · 🇦🇺 A$450.000. Leasing ab €3.900/Monat.',
      'zh': '参考价格:🇪🇺 €198,000 · 🇬🇧 £220,000(最高 £81,000 英国补贴)· 🇺🇸 $285,000($120,000+ HVIP)· 🇦🇺 A$450,000。月租赁从€3,900起。点击价格卡片咨询。',
      'nl': 'Indicatieve prijzen: 🇪🇺 €250.000 · 🇬🇧 £220.000 (t/m £81.000 subsidie) · 🇺🇸 $300.000 ($120.000+ HVIP) · 🇦🇺 A$450.000. Lease vanaf €3.900/maand.',
      'no': 'Veiledende priser: 🇪🇺 €250 000 · 🇬🇧 £220 000 (opptil £81 000 tilskudd) · 🇺🇸 $300 000 ($120 000+ HVIP) · 🇦🇺 A$450 000. Leasing fra €3 900/mnd.','is':'Windrose E700 er verðlagt til díselsjafngildis alls staðar í heiminum. Evrópuverð frá €149,000 (án VSK). Bandaríkaverð frá $162,000. Leiguáætlanir eru tiltækar.',
      'sv': 'Vägledande priser: 🇪🇺 €250 000 · 🇬🇧 £220 000 (upp till £81 000 bidrag) · 🇺🇸 $300 000 ($120 000+ HVIP) · 🇦🇺 A$450 000. Leasing från €3 900/mån.',
      'fi': 'Ohjeelliset hinnat: 🇪🇺 €250 000 · 🇬🇧 £220 000 (jopa £81 000 tuki) · 🇺🇸 $300 000 ($120 000+ HVIP) · 🇦🇺 A$450 000. Leasing alkaen €3 900/kk.',
      'da': 'Vejledende priser: 🇪🇺 €250.000 · 🇬🇧 £220.000 (op til £81.000 tilskud) · 🇺🇸 $300.000 ($120.000+ HVIP) · 🇦🇺 A$450.000. Leasing fra €3.900/md.',
      'pl': 'Ceny orientacyjne: 🇪🇺 €250 000 · 🇬🇧 £220 000 (do £81 000 dotacji) · 🇺🇸 $300 000 ($120 000+ HVIP) · 🇦🇺 A$450 000. Leasing od €3 900/mies.',
      'it': 'Prezzi indicativi: 🇪🇺 €250.000 · 🇬🇧 £220.000 (fino a £81.000 di sussidio) · 🇺🇸 $300.000 ($120.000+ HVIP) · 🇦🇺 A$450.000. Leasing da €3.900/mese.',
      'pt': 'Preços indicativos: 🇪🇺 €250.000 · 🇬🇧 £220.000 (até £81.000 de subsídio) · 🇺🇸 $300.000 ($120.000+ HVIP) · 🇦🇺 A$450.000. Leasing a partir de €3.900/mês.',
      'ja': '参考価格: 🇪🇺 €198,000 · 🇬🇧 £220,000 (英国補助金最大£81,000) · 🇺🇸 $285,000 (HVIP $120,000+) · 🇦🇺 A$450,000。月額リース€3,900〜。価格カードをクリックしてお問い合わせください。',
      'ko': '참고 가격: 🇪🇺 €198,000 · 🇬🇧 £220,000 (최대 £81,000 영국 보조금) · 🇺🇸 $285,000 (HVIP $120,000+) · 🇦🇺 A$450,000. 월 리스 €3,900부터. 가격 카드를 클릭하여 문의하세요.',
    },
    'delivery': {
      'en': '• Q3 2026 — 60% advanced payment for priority allocation\n• Q4 2026 — 5% deposit to reserve, balance due before delivery',
      'fr': 'T3 2026 avec 60% de paiement anticipé (allocation prioritaire). T4 2026 avec un acompte standard de 5%, solde dû avant livraison.',
      'de': 'Q3 2026 mit 60% Vorauszahlung (Prioritätsallokation). Q4 2026 mit Standard 5% Anzahlung, Restzahlung vor Lieferung.',
      'zh': '2026年第三季度交付:需60%预付款(优先分配)。2026年第四季度:5%订金预定,余款交付前付清。',
      'nl': 'Q3 2026 met 60% vooruitbetaling (prioriteitstoewijzing). Q4 2026 met standaard 5% aanbetaling, saldo voor levering.',
      'no': 'Q3 2026 med 60% forskuddsbetaling (prioritetstildeling). Q4 2026 med standard 5% depositum, saldo forfaller før levering.','is':'Afhendingar eru í gangi á Evrópu, Bandaríkjunum, Ástralíu og Asíu-Kyrrahafi. Meðalafhendingartími er 8-12 vikur eftir pöntun.',
      'sv': 'Q3 2026 med 60% förskottsbetalning (prioritetsallokering). Q4 2026 med standard 5% handpenning, saldo förfaller före leverans.',
      'fi': 'Q3 2026 60% ennakkomaksulla (prioriteettijako). Q4 2026 vakio 5% talletuksella, loppusumma ennen toimitusta.',
      'da': 'Q3 2026 med 60% forudbetaling (prioritetstildeling). Q4 2026 med standard 5% depositum, saldo forfalder inden levering.',
      'pl': 'Q3 2026 przy 60% zaliczce (przydział priorytetowy). Q4 2026 przy standardowej kaucji 5%, saldo płatne przed dostawą.',
      'it': 'Q3 2026 con pagamento anticipato del 60% (allocazione prioritaria). Q4 2026 con deposito standard del 5%, saldo dovuto prima della consegna.',
      'pt': 'Q3 2026 com 60% de pagamento antecipado (alocação prioritária). Q4 2026 com depósito padrão de 5%, saldo devido antes da entrega.',
      'ja': '2026年Q3納車: 60%前払い (優先割当)。2026年Q4: 5%デポジットで予約、残金は納車前にお支払い。',
      'ko': '2026년 Q3 인도: 우선 배정을 위해 60% 선불 결제 필요. 2026년 Q4: 표준 5% 보증금으로 예약, 잔금은 인도 전 지불.',
    },
    'order': {
      'en': '• Click any price card on this page to email our sales team\n• Or write directly to sales@windrose.ai\n• Or use the Reserve button at the top of the page',
      'fr': 'Cliquez sur n\'importe quelle carte de prix pour envoyer un e-mail à notre équipe commerciale, ou écrivez à sales@windrose.ai. Vous pouvez aussi utiliser le bouton Réserver en haut de la page.',
      'de': 'Klicken Sie auf eine Preiskarte, um unserem Vertriebsteam eine E-Mail zu senden, oder schreiben Sie an sales@windrose.ai. Sie können auch den Reservieren-Button oben auf der Seite verwenden.',
      'zh': '点击页面上任何价格卡片即可联系销售团队,或发送邮件至sales@windrose.ai。也可使用页面顶部的预定按钮。',
      'nl': 'Klik op een prijskaart om ons verkoopteam te e-mailen, of schrijf naar sales@windrose.ai. U kunt ook de knop Reserveer bovenaan de pagina gebruiken.',
      'no': 'Klikk på et priskort for å sende e-post til salgsteamet, eller skriv til sales@windrose.ai. Du kan også bruke Reserver-knappen øverst på siden.','is':'Pantaðu beint á vefsíðunni okkar með frátekningu eða hafðu samband við næsta umboðsmann. Flottar pantanir og sérsniðin uppsetning eru tiltæk.',
      'sv': 'Klicka på ett priskort för att maila vårt säljteam, eller skriv till sales@windrose.ai. Du kan också använda Reservera-knappen längst upp på sidan.',
      'fi': 'Napsauta mitä tahansa hintakorttia lähettääksesi sähköpostia myyntitiimillemme tai kirjoita osoitteeseen sales@windrose.ai. Voit myös käyttää sivun yläosassa olevaa Varaa-painiketta.',
      'da': 'Klik på et priskort for at sende e-mail til vores salgsteam, eller skriv til sales@windrose.ai. Du kan også bruge knappen Reservér øverst på siden.',
      'pl': 'Kliknij dowolną kartę cenową, aby wysłać e-mail do naszego zespołu sprzedaży, lub napisz na sales@windrose.ai. Możesz też użyć przycisku Zarezerwuj na górze strony.',
      'it': 'Clicca su qualsiasi scheda prezzi per inviare un\'e-mail al nostro team vendite, o scrivi a sales@windrose.ai. Puoi anche usare il pulsante Prenota in cima alla pagina.',
      'pt': 'Clique em qualquer cartão de preço para enviar um e-mail à nossa equipa de vendas, ou escreva para sales@windrose.ai. Pode também usar o botão Reservar no topo da página.',
      'ja': 'ページ上の価格カードをクリックして営業チームにメールするか、sales@windrose.aiまでご連絡ください。ページ上部の予約ボタンもご利用いただけます。',
      'ko': '페이지의 가격 카드를 클릭하여 영업팀에 이메일을 보내거나 sales@windrose.ai로 문의하세요. 페이지 상단의 예약 버튼도 사용할 수 있습니다.',
    },
    'charge': {
      'en': '• 870 kW MCS — 20% to 80% in 38 minutes\n• 800V architecture supports MCS, CCS2, CCS1, and GB/T\n• Validated at 100% of MCS sites in Europe\n• Partners: Milence, Kempower, EV Realty, Greenlane\n• 3 months free charging included with every purchase',
      'fr': 'Le Windrose E700 se recharge à 870 kW MCS — 20% à 80% en 38 minutes. Architecture 800V avec les standards MCS, CCS2, CCS1 et GB/T. Validé sur 100% des sites MCS en Europe avec Milence, Kempower, EV Realty et Greenlane (3 mois de recharge gratuite à chaque achat).',
      'de': 'Der Windrose E700 lädt mit 870 kW MCS — 20% auf 80% in 38 Minuten. 800V-Architektur mit MCS, CCS2, CCS1 und GB/T. An 100% der MCS-Standorte in Europa validiert, mit Partnern Milence, Kempower, EV Realty und Greenlane (3 Monate kostenloses Laden bei jedem Kauf).',
      'nl': 'De Windrose E700 laadt op 870 kW MCS — 20% naar 80% in 38 minuten. 800V-architectuur met MCS, CCS2, CCS1 en GB/T-standaarden. Gevalideerd op 100% van de MCS-locaties in Europa met partners Milence, Kempower, EV Realty en Greenlane (3 maanden gratis laden bij elke aankoop).',
      'no': 'Windrose E700 lader på 870 kW MCS — 20% til 80% på 38 minutter. 800V-arkitektur med MCS, CCS2, CCS1 og GB/T-standarder. Validert på 100% av MCS-stedene i Europa med partnere Milence, Kempower, EV Realty og Greenlane (3 måneder gratis lading med hvert kjøp).','is':'Windrose E700 styður MCS (870 kW), CCS2 (350 kW), CHAdeMO og NACS. Frá 10% til 80% á um 38 mínútum með MCS.',
      'sv': 'Windrose E700 laddar vid 870 kW MCS — 20% till 80% på 38 minuter. 800V-arkitektur med MCS, CCS2, CCS1 och GB/T. Validerad vid 100% av MCS-platserna i Europa med partners Milence, Kempower, EV Realty och Greenlane (3 månaders fri laddning vid varje köp).',
      'fi': 'Windrose E700 lataa 870 kW MCS:llä — 20% → 80% 38 minuutissa. 800V-arkkitehtuuri MCS-, CCS2-, CCS1- ja GB/T-standardeilla. Validoitu 100% Euroopan MCS-asemilla kumppaneiden Milence, Kempower, EV Realty ja Greenlane kanssa (3 kk ilmainen lataus jokaisen oston yhteydessä).',
      'da': 'Windrose E700 oplader ved 870 kW MCS — 20% til 80% på 38 minutter. 800V-arkitektur med MCS, CCS2, CCS1 og GB/T-standarder. Valideret på 100% af MCS-steder i Europa med partnerne Milence, Kempower, EV Realty og Greenlane (3 måneders gratis opladning ved hvert køb).',
      'pl': 'Windrose E700 ładuje się z mocą 870 kW MCS — z 20% do 80% w 38 minut. Architektura 800V ze standardami MCS, CCS2, CCS1 i GB/T. Zwalidowany na 100% stacji MCS w Europie z partnerami Milence, Kempower, EV Realty i Greenlane (3 miesiące darmowego ładowania przy każdym zakupie).',
      'it': 'Il Windrose E700 si ricarica a 870 kW MCS — dal 20% all\'80% in 38 minuti. Architettura 800V con standard MCS, CCS2, CCS1 e GB/T. Validato sul 100% delle stazioni MCS in Europa con partner Milence, Kempower, EV Realty e Greenlane (3 mesi di ricarica gratuita ad ogni acquisto).',
      'pt': 'O Windrose E700 carrega a 870 kW MCS — 20% a 80% em 38 minutos. Arquitetura 800V com padrões MCS, CCS2, CCS1 e GB/T. Validado em 100% dos locais MCS na Europa com parceiros Milence, Kempower, EV Realty e Greenlane (3 meses de carregamento grátis a cada compra).',
      'ja': 'Windrose E700は870 kW MCSで充電 — 38分で20%→80%。MCS、CCS2、CCS1、GB/T規格対応の800Vアーキテクチャ。欧州のMCSサイト100%で検証済み。パートナー: Milence、Kempower、EV Realty、Greenlane(購入毎に3か月無料充電)。',
      'ko': 'Windrose E700은 870 kW MCS로 충전 — 20%에서 80%까지 38분. MCS, CCS2, CCS1, GB/T 표준의 800V 아키텍처. 유럽 MCS 사이트 100%에서 검증. 파트너: Milence, Kempower, EV Realty, Greenlane (구매 시 3개월 무료 충전).',
      'zh': 'Windrose E700采用870 kW MCS充电——38分钟内从20%充至80%。800V架构,支持MCS、CCS2、CCS1和GB/T标准。已在欧洲100%的MCS站点验证,合作伙伴包括Milence、Kempower、EV Realty和Greenlane(每次购买赠送3个月免费充电)。',
    },
    'specs': {
      'en': '• 705 kWh LFP battery at 800V\n• 1,400 hp (1,045 kW) motor, 120 km/h top speed\n• 7.5% climbing ability fully loaded\n• Dimensions: 8.1m × 2.5m × 3.9m — curb 11,835 kg, GCW 49,000 kg\n• Tested −32°C to +48°C, up to 4,700m altitude',
      'fr': 'Windrose E700 : batterie LFP 705 kWh à 800V, moteur 1 400 ch (1 045 kW), vitesse max 120 km/h, capacité de montée 7,5% en pleine charge. Dimensions 8,1m × 2,5m × 3,9m. Poids à vide 11 835 kg, PTRA 49 000 kg. Testé de -32°C à +48°C, jusqu\'à 4 700m d\'altitude.',
      'de': 'Windrose E700: 705-kWh-LFP-Batterie bei 800V, 1.400 PS (1.045 kW) Motor, 120 km/h Spitze, 7,5% Steigfähigkeit voll beladen. Maße 8,1m × 2,5m × 3,9m. Leergewicht 11.835 kg, GCW 49.000 kg. Getestet von -32°C bis +48°C, bis 4.700m Höhe.',
      'nl': 'Windrose E700: 705 kWh LFP-batterij op 800V, 1.400 pk (1.045 kW) motor, topsnelheid 120 km/u, klimvermogen 7,5% volledig beladen. Afmetingen 8,1m × 2,5m × 3,9m. Leeggewicht 11.835 kg, GCW 49.000 kg. Getest van -32°C tot +48°C, tot 4.700m hoogte.',
      'no': 'Windrose E700: 705 kWh LFP-batteri ved 800V, 1 400 hk (1 045 kW) motor, toppfart 120 km/t, stigeevne 7,5% fullt lastet. Mål 8,1m × 2,5m × 3,9m. Egenvekt 11 835 kg, GCW 49 000 kg. Testet fra -32°C til +48°C, opptil 4 700m høyde.','is':'Windrose E700: 522 kWh rafhlaða, 700 km drægni, 11.75 tonn eigin þyngd, 49 tonn GVW (einn eftirvagn), 64 tonn GCW (tvöfaldur eftirvagn). Þrjár mótorgerðir: 390 kW, 520 kW, 650 kW.',
      'sv': 'Windrose E700: 705 kWh LFP-batteri vid 800V, 1 400 hk (1 045 kW) motor, topphastighet 120 km/h, stigningsförmåga 7,5% fullastad. Mått 8,1m × 2,5m × 3,9m. Tjänstevikt 11 835 kg, GCW 49 000 kg. Testad från -32°C till +48°C, upp till 4 700m höjd.',
      'fi': 'Windrose E700: 705 kWh LFP-akku 800V:ssa, 1 400 hv (1 045 kW) moottori, huippunopeus 120 km/h, nousukyky 7,5% täydellä kuormalla. Mitat 8,1m × 2,5m × 3,9m. Omapaino 11 835 kg, GCW 49 000 kg. Testattu -32°C → +48°C, jopa 4 700m korkeudessa.',
      'da': 'Windrose E700: 705 kWh LFP-batteri ved 800V, 1.400 hk (1.045 kW) motor, tophastighed 120 km/t, stigeevne 7,5% fuldt lastet. Mål 8,1m × 2,5m × 3,9m. Egenvægt 11.835 kg, GCW 49.000 kg. Testet fra -32°C til +48°C, op til 4.700m højde.',
      'pl': 'Windrose E700: bateria LFP 705 kWh przy 800V, silnik 1 400 KM (1 045 kW), prędkość maks. 120 km/h, zdolność wspinaczki 7,5% przy pełnym obciążeniu. Wymiary 8,1m × 2,5m × 3,9m. Masa własna 11 835 kg, DMC 49 000 kg. Testowany od -32°C do +48°C, do 4 700m wysokości.',
      'it': 'Windrose E700: batteria LFP 705 kWh a 800V, motore 1.400 CV (1.045 kW), velocità max 120 km/h, capacità di salita 7,5% a pieno carico. Dimensioni 8,1m × 2,5m × 3,9m. Tara 11.835 kg, MTC 49.000 kg. Testato da -32°C a +48°C, fino a 4.700m di altitudine.',
      'pt': 'Windrose E700: bateria LFP de 705 kWh a 800V, motor de 1.400 cv (1.045 kW), velocidade máxima 120 km/h, capacidade de subida 7,5% totalmente carregado. Dimensões 8,1m × 2,5m × 3,9m. Tara 11.835 kg, PBTC 49.000 kg. Testado de -32°C a +48°C, até 4.700m de altitude.',
      'ja': 'Windrose E700: 800Vの705 kWh LFP電池、1,400馬力 (1,045 kW) モーター、最高速度120 km/h、満載時登坂能力7.5%。寸法 8.1m × 2.5m × 3.9m。車両重量 11,835 kg、GCW 49,000 kg。-32°C〜+48°C、標高4,700mまでテスト済み。',
      'ko': 'Windrose E700: 800V 705 kWh LFP 배터리, 1,400마력 (1,045 kW) 모터, 최고 속도 120 km/h, 만재 시 등판능력 7.5%. 치수 8.1m × 2.5m × 3.9m. 공차중량 11,835 kg, 총중량 49,000 kg. -32°C에서 +48°C, 고도 4,700m까지 테스트.',
      'zh': 'Windrose E700:705 kWh LFP电池(800V)、1,400马力(1,045 kW)电机、最高时速120 km/h、满载爬坡能力7.5%。尺寸8.1m × 2.5m × 3.9m。整备质量11,835 kg,总重49,000 kg。测试温度-32°C至+48°C,海拔最高4,700米。',
    },
    'lease': {
      'en': '• 🇪🇺 €3,900/mo (5-year, 20% residual)\n• 🇬🇧 £2,200/mo after UK grant\n• 🇺🇸 $3,100/mo after HVIP\n• 🇦🇺 A$7,200/mo\n• Tailored financing: sales@windrose.ai',
      'fr': 'Estimations de location (5 ans, valeur résiduelle 20%) : 🇪🇺 3 900 €/mois, 🇬🇧 2 200 £/mois après subvention, 🇺🇸 3 100 $/mois après HVIP, 🇦🇺 7 200 A$/mois. Financement sur mesure : sales@windrose.ai.',
      'de': 'Leasing-Schätzungen (5 Jahre, 20% Restwert): 🇪🇺 3.900 €/Mon., 🇬🇧 2.200 £/Mon. nach Förderung, 🇺🇸 3.100 $/Mon. nach HVIP, 🇦🇺 7.200 A$/Mon. Individuelle Finanzierung: sales@windrose.ai.',
      'nl': 'Leaseramingen (5 jaar, 20% restwaarde): 🇪🇺 €3.900/mnd, 🇬🇧 £2.200/mnd na subsidie, 🇺🇸 $3.100/mnd na HVIP, 🇦🇺 A$7.200/mnd. Op maat gemaakte financiering: sales@windrose.ai.',
      'no': 'Leasingestimater (5-årig løpetid, 20% restverdi): 🇪🇺 €3 900/mnd, 🇬🇧 £2 200/mnd etter tilskudd, 🇺🇸 $3 100/mnd etter HVIP, 🇦🇺 A$7 200/mnd. Skreddersydd finansiering: sales@windrose.ai.','is':'Leiga er tiltæk í flestum löndum í gegnum fjármögnunarfélög og bankafélaga. Skrá sig á vefsíðuna til að fá nýjustu kjör.',
      'sv': 'Leasingestimat (5-årig löptid, 20% restvärde): 🇪🇺 €3 900/mån, 🇬🇧 £2 200/mån efter bidrag, 🇺🇸 $3 100/mån efter HVIP, 🇦🇺 A$7 200/mån. Skräddarsydd finansiering: sales@windrose.ai.',
      'fi': 'Leasing-arviot (5 v., 20% jäännösarvo): 🇪🇺 3 900 €/kk, 🇬🇧 2 200 £/kk avustuksen jälkeen, 🇺🇸 3 100 $/kk HVIP:n jälkeen, 🇦🇺 7 200 A$/kk. Räätälöity rahoitus: sales@windrose.ai.',
      'da': 'Leasingestimater (5-årig løbetid, 20% restværdi): 🇪🇺 €3.900/md, 🇬🇧 £2.200/md efter tilskud, 🇺🇸 $3.100/md efter HVIP, 🇦🇺 A$7.200/md. Skræddersyet finansiering: sales@windrose.ai.',
      'pl': 'Szacunki leasingowe (5 lat, wartość rezydualna 20%): 🇪🇺 3 900 €/mies., 🇬🇧 2 200 £/mies. po dotacji, 🇺🇸 3 100 $/mies. po HVIP, 🇦🇺 7 200 A$/mies. Indywidualne finansowanie: sales@windrose.ai.',
      'it': 'Stime di leasing (5 anni, valore residuo 20%): 🇪🇺 €3.900/mese, 🇬🇧 £2.200/mese dopo sussidio, 🇺🇸 $3.100/mese dopo HVIP, 🇦🇺 A$7.200/mese. Finanziamento su misura: sales@windrose.ai.',
      'pt': 'Estimativas de leasing (prazo de 5 anos, valor residual 20%): 🇪🇺 €3.900/mês, 🇬🇧 £2.200/mês após subsídio, 🇺🇸 $3.100/mês após HVIP, 🇦🇺 A$7.200/mês. Financiamento personalizado: sales@windrose.ai.',
      'ja': 'リース推定 (5年契約、残価20%): 🇪🇺 €3,900/月、🇬🇧 £2,200/月 (補助金後)、🇺🇸 $3,100/月 (HVIP後)、🇦🇺 A$7,200/月。個別ファイナンス: sales@windrose.ai。',
      'ko': '리스 견적 (5년 약정, 잔존가치 20%): 🇪🇺 €3,900/월, 🇬🇧 £2,200/월 (보조금 후), 🇺🇸 $3,100/월 (HVIP 후), 🇦🇺 A$7,200/월. 맞춤형 금융: sales@windrose.ai.',
      'zh': '租赁估算(5年期,残值20%):🇪🇺 €3,900/月、🇬🇧 £2,200/月(补贴后)、🇺🇸 $3,100/月(HVIP后)、🇦🇺 A$7,200/月。定制融资请联系: sales@windrose.ai。',
    },
    'battery': {
      'en': 'Windrose uses LFP (lithium iron phosphate) at 705 kWh, 800V — safe chemistry, long life. Next-gen LMFP: 1.3x energy density, 2x lifetime (1 million km), 2x heat tolerance.',
      'fr': 'Windrose utilise LFP (lithium fer phosphate) 705 kWh, 800V — chimie sûre, longue durée. Prochaine génération LMFP : densité énergétique 1,3x, durée de vie 2x (1 million de km), tolérance thermique 2x.',
      'de': 'Windrose verwendet LFP (Lithium-Eisen-Phosphat) mit 705 kWh, 800V — sichere Chemie, lange Lebensdauer. Nächste Generation LMFP: 1,3x Energiedichte, 2x Lebensdauer (1 Mio. km), 2x Hitzetoleranz.',
      'nl': 'Windrose gebruikt LFP (lithium-ijzerfosfaat) van 705 kWh, 800V — veilige chemie, lange levensduur. Volgende generatie LMFP: 1,3x energiedichtheid, 2x levensduur (1 miljoen km), 2x hittetolerantie.',
      'no': 'Windrose bruker LFP (litium-jern-fosfat) på 705 kWh, 800V — trygg kjemi, lang levetid. Neste generasjon LMFP: 1,3x energitetthet, 2x levetid (1 million km), 2x varmebestandighet.','is':'522 kWh NMC rafhlaða með varmastjórnunarkerfi. Trygging: 80% getu eftir 1,000,000 km eða 10 ár.',
      'sv': 'Windrose använder LFP (litiumjärnfosfat) vid 705 kWh, 800V — säker kemi, lång livslängd. Nästa generation LMFP: 1,3x energitäthet, 2x livslängd (1 miljon km), 2x värmetålighet.',
      'fi': 'Windrose käyttää LFP-akkua (litium-rautafosfaatti) 705 kWh, 800V — turvallinen kemia, pitkä käyttöikä. Seuraavan sukupolven LMFP: 1,3x energiatiheys, 2x käyttöikä (1 miljoona km), 2x lämmönsietokyky.',
      'da': 'Windrose bruger LFP (lithium-jernfosfat) ved 705 kWh, 800V — sikker kemi, lang levetid. Næste generation LMFP: 1,3x energitæthed, 2x levetid (1 million km), 2x varmebestandighed.',
      'pl': 'Windrose stosuje LFP (litowo-żelazo-fosforanowa) o pojemności 705 kWh, 800V — bezpieczna chemia, długa żywotność. Następna generacja LMFP: 1,3x gęstość energii, 2x żywotność (1 mln km), 2x odporność termiczna.',
      'it': 'Windrose usa LFP (litio ferro fosfato) a 705 kWh, 800V — chimica sicura, lunga durata. Prossima generazione LMFP: densità energetica 1,3x, durata di vita 2x (1 milione di km), tolleranza termica 2x.',
      'pt': 'A Windrose usa LFP (lítio ferro fosfato) de 705 kWh, 800V — química segura, longa duração. Próxima geração LMFP: 1,3x densidade energética, 2x vida útil (1 milhão km), 2x tolerância térmica.',
      'ja': 'WindroseはLFP (リン酸鉄リチウム) 705 kWh、800Vを採用 — 安全な化学反応、長寿命。次世代LMFP: エネルギー密度1.3倍、寿命2倍 (100万km)、耐熱性2倍。',
      'ko': 'Windrose는 LFP (인산철리튬) 705 kWh, 800V 사용 — 안전한 화학, 긴 수명. 차세대 LMFP: 에너지 밀도 1.3배, 수명 2배 (100만 km), 내열성 2배.',
      'zh': 'Windrose采用705 kWh、800V LFP(磷酸铁锂)电池——化学性质安全,寿命长。下一代LMFP:能量密度1.3倍、寿命2倍(100万公里)、耐热性2倍。',
    },
    'about': {
      'en': 'Windrose Electric is a global manufacturer of electric long-haul trucks. Founded in 2022, headquartered in Antwerp, Belgium. Deployed in 24 countries across 5 continents. Listed on NYSE. Recognized by TIME100 Most Influential Companies 2026.',
      'fr': 'Windrose Electric est un constructeur mondial de camions électriques longue distance. Fondé en 2022, siège à Anvers, Belgique. Déployé dans 24 pays sur 5 continents. Coté au NYSE. Reconnu par TIME100 Most Influential Companies 2026.',
      'de': 'Windrose Electric ist ein globaler Hersteller von elektrischen Langstrecken-Lkw. Gegründet 2022, Hauptsitz in Antwerpen, Belgien. Eingesetzt in 24 Ländern auf 5 Kontinenten. An der NYSE notiert. Ausgezeichnet bei TIME100 Most Influential Companies 2026.',
      'nl': 'Windrose Electric is een wereldwijde fabrikant van elektrische langeafstandstrucks. Opgericht in 2022, hoofdkantoor in Antwerpen, België. Actief in 24 landen op 5 continenten. Genoteerd aan NYSE. Erkend door TIME100 Most Influential Companies 2026.',
      'no': 'Windrose Electric er en global produsent av elektriske langtransporttrucks. Grunnlagt i 2022, hovedkontor i Antwerpen, Belgia. Utplassert i 24 land på 5 kontinenter. Notert på NYSE. Anerkjent av TIME100 Most Influential Companies 2026.','is':'Windrose Technology er belgískt-kínverskt rafmagnsbílafrumkvæðisfyrirtæki stofnað árið 2022 af Wen HAN. Höfuðstöðvar í Antwerpen, Belgíu. Framleiðsla í Kína, Evrópu og Bandaríkjunum.',
      'sv': 'Windrose Electric är en global tillverkare av elektriska långdistanslastbilar. Grundat 2022, huvudkontor i Antwerpen, Belgien. Verksamt i 24 länder på 5 kontinenter. Noterat på NYSE. Erkänd av TIME100 Most Influential Companies 2026.',
      'fi': 'Windrose Electric on globaali sähköisten kaukoliikenteen kuorma-autojen valmistaja. Perustettu 2022, pääkonttori Antwerpenissä, Belgiassa. Käytössä 24 maassa 5 mantereella. Listattu NYSE:ssä. TIME100 Most Influential Companies 2026 -tunnustus.',
      'da': 'Windrose Electric er en global producent af elektriske langdistance-lastbiler. Grundlagt i 2022, hovedkvarter i Antwerpen, Belgien. Aktiv i 24 lande på 5 kontinenter. Noteret på NYSE. Anerkendt af TIME100 Most Influential Companies 2026.',
      'pl': 'Windrose Electric to globalny producent elektrycznych ciężarówek dalekobieżnych. Założony w 2022, siedziba w Antwerpii, Belgia. Obecny w 24 krajach na 5 kontynentach. Notowany na NYSE. Wyróżniony przez TIME100 Most Influential Companies 2026.',
      'it': 'Windrose Electric è un produttore globale di camion elettrici a lungo raggio. Fondata nel 2022, sede ad Anversa, Belgio. Operativa in 24 paesi su 5 continenti. Quotata al NYSE. Riconosciuta da TIME100 Most Influential Companies 2026.',
      'pt': 'A Windrose Electric é uma fabricante global de camiões elétricos de longo curso. Fundada em 2022, sede em Antuérpia, Bélgica. Implantada em 24 países em 5 continentes. Cotada na NYSE. Reconhecida pela TIME100 Most Influential Companies 2026.',
      'ja': 'Windrose Electricは電気長距離トラックのグローバルメーカー。2022年設立、ベルギー・アントワープに本社。5大陸24か国で展開。NYSE上場。TIME100 Most Influential Companies 2026に選出。',
      'ko': 'Windrose Electric은 전기 장거리 트럭의 글로벌 제조업체. 2022년 설립, 벨기에 안트베르펜 본사. 5대륙 24개국에서 운영. NYSE 상장. TIME100 Most Influential Companies 2026 선정.',
      'zh': 'Windrose Electric是全球电动长途卡车制造商。2022年成立,总部位于比利时安特卫普。已在5大洲24个国家部署。在纽约证券交易所上市。荣获TIME100 Most Influential Companies 2026认可。',
    },
    'founder': {
      'en': 'Windrose was founded in 2022 by Wen Han, a Stanford University graduate. Wen serves as Founder, Chairman, and CEO. Based at our headquarters in Antwerp, Belgium.',
      'fr': 'Windrose a été fondée en 2022 par Wen Han, diplômé de l\'Université de Stanford. Wen est Fondateur, Président et PDG. Basé à notre siège d\'Anvers, Belgique.',
      'de': 'Windrose wurde 2022 von Wen Han, einem Absolventen der Stanford University, gegründet. Wen ist Gründer, Vorstandsvorsitzender und CEO. Sitz in unserem Hauptquartier in Antwerpen, Belgien.',
      'nl': 'Windrose werd in 2022 opgericht door Wen Han, afgestudeerd aan Stanford University. Wen is oprichter, voorzitter en CEO. Gevestigd op ons hoofdkantoor in Antwerpen, België.',
      'no': 'Windrose ble grunnlagt i 2022 av Wen Han, utdannet ved Stanford University. Wen er grunnlegger, styreleder og CEO. Basert ved hovedkontoret vårt i Antwerpen, Belgia.','is':'Wen HAN (韩文) er stofnandi og framkvæmdastjóri. MBA frá Stanford, brautskráning frá Williams College. Forbes Top 100, Fortune 40 under 40.',
      'sv': 'Windrose grundades 2022 av Wen Han, utbildad vid Stanford University. Wen är grundare, styrelseordförande och VD. Baserad vid vårt huvudkontor i Antwerpen, Belgien.',
      'fi': 'Windrosen perusti vuonna 2022 Wen Han, Stanfordin yliopiston kasvatti. Wen toimii perustajana, hallituksen puheenjohtajana ja toimitusjohtajana. Pääkonttorissamme Antwerpenissä, Belgiassa.',
      'da': 'Windrose blev grundlagt i 2022 af Wen Han, uddannet fra Stanford University. Wen er grundlægger, bestyrelsesformand og CEO. Baseret ved vores hovedkvarter i Antwerpen, Belgien.',
      'pl': 'Windrose została założona w 2022 roku przez Wen Hana, absolwenta Stanford University. Wen pełni funkcję założyciela, prezesa zarządu i CEO. Siedziba: nasza centrala w Antwerpii, Belgia.',
      'it': 'Windrose è stata fondata nel 2022 da Wen Han, laureato alla Stanford University. Wen è Fondatore, Presidente e CEO. Con sede presso il nostro quartier generale ad Anversa, Belgio.',
      'pt': 'A Windrose foi fundada em 2022 por Wen Han, formado pela Stanford University. Wen é Fundador, Presidente e CEO. Baseado na nossa sede em Antuérpia, Bélgica.',
      'ja': 'Windroseは2022年、スタンフォード大学卒業のWen Han氏により設立。Wen氏は創業者、会長兼CEOを務める。本拠地はベルギー・アントワープの本社。',
      'ko': 'Windrose는 2022년 스탠퍼드 대학교 졸업생인 Wen Han에 의해 설립되었습니다. Wen은 창업자, 회장 겸 CEO를 맡고 있습니다. 본사는 벨기에 안트베르펜에 위치합니다.',
      'zh': 'Windrose由斯坦福大学毕业生Wen Han于2022年创立。Wen担任创始人、董事长兼首席执行官。基地位于比利时安特卫普总部。',
    },
    'investors': {
      'en': 'Windrose is backed by HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group, and other world-renowned investors. Listed on the New York Stock Exchange (NYSE).',
      'fr': 'Windrose est soutenu par HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group et d\'autres investisseurs de renommée mondiale. Coté au New York Stock Exchange (NYSE).',
      'de': 'Windrose wird unterstützt von HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group und weiteren weltweit renommierten Investoren. Notiert an der New York Stock Exchange (NYSE).',
      'nl': 'Windrose wordt ondersteund door HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group en andere wereldwijd erkende investeerders. Genoteerd aan de New York Stock Exchange (NYSE).',
      'no': 'Windrose støttes av HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group og andre verdenskjente investorer. Notert på New York Stock Exchange (NYSE).','is':'Fjárfestar eru m.a. FountainVest Partners, HITE Hedge, GSR Ventures og Yunqi Capital. Fjármögnunarbankar eru ICBC, CCB, ABC og BOC.',
      'sv': 'Windrose stöds av HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group och andra världsbekanta investerare. Noterat på New York Stock Exchange (NYSE).',
      'fi': 'Windrosea tukevat HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group ja muut maailmankuulut sijoittajat. Listattu New Yorkin pörssissä (NYSE).',
      'da': 'Windrose er støttet af HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group og andre verdenskendte investorer. Noteret på New York Stock Exchange (NYSE).',
      'pl': 'Windrose ma wsparcie HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group oraz innych światowej klasy inwestorów. Notowany na New York Stock Exchange (NYSE).',
      'it': 'Windrose è sostenuta da HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group e altri investitori di fama mondiale. Quotata al New York Stock Exchange (NYSE).',
      'pt': 'A Windrose tem o apoio de HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group e outros investidores de renome mundial. Cotada na New York Stock Exchange (NYSE).',
      'ja': 'WindroseはHSBC、Citi、Fountainvest、GSR Ventures、HITE Hedge、Goodman Groupなど世界的に著名な投資家の支援を受ける。ニューヨーク証券取引所 (NYSE) 上場。',
      'ko': 'Windrose는 HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group 등 세계적으로 유명한 투자자의 지원을 받고 있습니다. 뉴욕증권거래소 (NYSE) 상장.',
      'zh': 'Windrose获得汇丰、花旗、Fountainvest、GSR Ventures、HITE Hedge、Goodman Group等世界知名投资者的支持。在纽约证券交易所(NYSE)上市。',
    },
    'customers': {
      'en': 'Windrose serves top global logistics: CEVA Logistics, Kuehne+Nagel, KLN (Kerry Logistics), DSV, plus brands like Decathlon, Rémy Cointreau, Nestlé Wyeth, Bluescope, Walmart Chile, and Danske Fragtmænd.',
      'fr': 'Windrose sert les leaders mondiaux de la logistique : CEVA Logistics, Kuehne+Nagel, KLN (Kerry Logistics), DSV, ainsi que des marques comme Decathlon, Rémy Cointreau, Nestlé Wyeth, Bluescope, Walmart Chile et Danske Fragtmænd.',
      'de': 'Windrose beliefert führende globale Logistikunternehmen: CEVA Logistics, Kuehne+Nagel, KLN (Kerry Logistics), DSV, sowie Marken wie Decathlon, Rémy Cointreau, Nestlé Wyeth, Bluescope, Walmart Chile und Danske Fragtmænd.',
      'nl': 'Windrose bedient toonaangevende logistieke bedrijven: CEVA Logistics, Kuehne+Nagel, KLN (Kerry Logistics), DSV, evenals merken als Decathlon, Rémy Cointreau, Nestlé Wyeth, Bluescope, Walmart Chile en Danske Fragtmænd.',
      'no': 'Windrose betjener verdens ledende logistikkaktører: CEVA Logistics, Kuehne+Nagel, KLN (Kerry Logistics), DSV, samt merker som Decathlon, Rémy Cointreau, Nestlé Wyeth, Bluescope, Walmart Chile og Danske Fragtmænd.','is':'Viðskiptavinir eru m.a. CEVA Logistics, Kuehne+Nagel, Decathlon, DSV og BlueScope Steel. 24 lönd og 5 heimsálfur.',
      'sv': 'Windrose betjänar världens ledande logistikaktörer: CEVA Logistics, Kuehne+Nagel, KLN (Kerry Logistics), DSV, samt varumärken som Decathlon, Rémy Cointreau, Nestlé Wyeth, Bluescope, Walmart Chile och Danske Fragtmænd.',
      'fi': 'Windrose palvelee maailman johtavia logistiikkayrityksiä: CEVA Logistics, Kuehne+Nagel, KLN (Kerry Logistics), DSV, sekä brändejä kuten Decathlon, Rémy Cointreau, Nestlé Wyeth, Bluescope, Walmart Chile ja Danske Fragtmænd.',
      'da': 'Windrose betjener verdens førende logistikvirksomheder: CEVA Logistics, Kuehne+Nagel, KLN (Kerry Logistics), DSV, samt mærker som Decathlon, Rémy Cointreau, Nestlé Wyeth, Bluescope, Walmart Chile og Danske Fragtmænd.',
      'pl': 'Windrose obsługuje czołowych globalnych operatorów logistycznych: CEVA Logistics, Kuehne+Nagel, KLN (Kerry Logistics), DSV, a także marki takie jak Decathlon, Rémy Cointreau, Nestlé Wyeth, Bluescope, Walmart Chile i Danske Fragtmænd.',
      'it': 'Windrose serve i principali operatori logistici globali: CEVA Logistics, Kuehne+Nagel, KLN (Kerry Logistics), DSV, oltre a marchi come Decathlon, Rémy Cointreau, Nestlé Wyeth, Bluescope, Walmart Chile e Danske Fragtmænd.',
      'pt': 'A Windrose serve os principais operadores logísticos globais: CEVA Logistics, Kuehne+Nagel, KLN (Kerry Logistics), DSV, bem como marcas como Decathlon, Rémy Cointreau, Nestlé Wyeth, Bluescope, Walmart Chile e Danske Fragtmænd.',
      'ja': 'Windroseは世界トップの物流企業にサービスを提供: CEVA Logistics、Kuehne+Nagel、KLN (Kerry Logistics)、DSV、加えてDecathlon、Rémy Cointreau、Nestlé Wyeth、Bluescope、Walmart Chile、Danske Fragtmændなどのブランド。',
      'ko': 'Windrose는 세계 최고의 물류 기업에 서비스를 제공합니다: CEVA Logistics, Kuehne+Nagel, KLN (Kerry Logistics), DSV, 그리고 Decathlon, Rémy Cointreau, Nestlé Wyeth, Bluescope, Walmart Chile, Danske Fragtmænd 같은 브랜드.',
      'zh': 'Windrose服务全球顶级物流企业:CEVA Logistics、Kuehne+Nagel、KLN(嘉里物流)、DSV,以及Decathlon、人头马君度、雀巢惠氏、Bluescope、智利沃尔玛和Danske Fragtmænd等品牌。',
    },
    'countries': {
      'en': 'Windrose is deployed in 24 countries across 5 continents — North America, Europe, South America, Asia, and Oceania. See the Network page for the full footprint.',
      'fr': 'Windrose est déployé dans 24 pays sur 5 continents — Amérique du Nord, Europe, Amérique du Sud, Asie et Océanie. Voir la page Réseau pour la couverture complète.',
      'de': 'Windrose ist in 24 Ländern auf 5 Kontinenten im Einsatz — Nordamerika, Europa, Südamerika, Asien und Ozeanien. Vollständige Übersicht auf der Network-Seite.',
      'nl': 'Windrose is actief in 24 landen op 5 continenten — Noord-Amerika, Europa, Zuid-Amerika, Azië en Oceanië. Zie de Network-pagina voor de volledige dekking.',
      'no': 'Windrose er utplassert i 24 land på 5 kontinenter — Nord-Amerika, Europa, Sør-Amerika, Asia og Oseania. Se Network-siden for full oversikt.','is':'Windrose E700 er í rekstri í 24 löndum á 5 heimsálfum: Evrópa, Norður-Ameríka, Ástralía, Asía og Suður-Ameríka.',
      'sv': 'Windrose är verksamt i 24 länder på 5 kontinenter — Nordamerika, Europa, Sydamerika, Asien och Oceanien. Se Network-sidan för fullständig täckning.',
      'fi': 'Windrose toimii 24 maassa 5 mantereella — Pohjois-Amerikka, Eurooppa, Etelä-Amerikka, Aasia ja Oseania. Katso täydellinen kattavuus Network-sivulta.',
      'da': 'Windrose er udbredt i 24 lande på 5 kontinenter — Nordamerika, Europa, Sydamerika, Asien og Oceanien. Se Network-siden for den fulde dækning.',
      'pl': 'Windrose działa w 24 krajach na 5 kontynentach — Ameryka Północna, Europa, Ameryka Południowa, Azja i Oceania. Pełna mapa: strona Network.',
      'it': 'Windrose è presente in 24 paesi su 5 continenti — Nord America, Europa, Sud America, Asia e Oceania. Vedi la pagina Network per la copertura completa.',
      'pt': 'A Windrose está presente em 24 países em 5 continentes — América do Norte, Europa, América do Sul, Ásia e Oceania. Veja a página Network para a cobertura completa.',
      'ja': 'Windroseは5大陸24か国で展開 — 北米、欧州、南米、アジア、オセアニア。完全なカバレッジはNetworkページをご覧ください。',
      'ko': 'Windrose는 5대륙 24개국에서 운영 — 북미, 유럽, 남미, 아시아, 오세아니아. 전체 커버리지는 Network 페이지에서 확인하세요.',
      'zh': 'Windrose已在5大洲24个国家部署——北美、欧洲、南美、亚洲和大洋洲。完整覆盖范围请查看Network页面。',
    },
    'manufacturing': {
      'en': 'Windrose has 5 manufacturing sites on 3 continents: 🇧🇪 Belgium (Port of Antwerp-Bruges), 🇨🇳 China (Suzhou), 🇫🇷 France (Hauts-de-France), 🇬🇧 UK (MIRA Technology Park), 🇺🇸 US (Aertssen Logistics — Rincon GA + Tacoma WA).',
      'fr': 'Windrose a 5 sites de production sur 3 continents : 🇧🇪 Belgique (Port d\'Anvers-Bruges), 🇨🇳 Chine (Suzhou), 🇫🇷 France (Hauts-de-France), 🇬🇧 Royaume-Uni (MIRA Technology Park), 🇺🇸 USA (Aertssen Logistics — Rincon GA + Tacoma WA).',
      'de': 'Windrose hat 5 Produktionsstandorte auf 3 Kontinenten: 🇧🇪 Belgien (Port of Antwerp-Bruges), 🇨🇳 China (Suzhou), 🇫🇷 Frankreich (Hauts-de-France), 🇬🇧 UK (MIRA Technology Park), 🇺🇸 USA (Aertssen Logistics — Rincon GA + Tacoma WA).',
      'nl': 'Windrose heeft 5 productielocaties op 3 continenten: 🇧🇪 België (Port of Antwerp-Bruges), 🇨🇳 China (Suzhou), 🇫🇷 Frankrijk (Hauts-de-France), 🇬🇧 VK (MIRA Technology Park), 🇺🇸 VS (Aertssen Logistics — Rincon GA + Tacoma WA).',
      'no': 'Windrose har 5 produksjonssteder på 3 kontinenter: 🇧🇪 Belgia (Port of Antwerp-Bruges), 🇨🇳 Kina (Suzhou), 🇫🇷 Frankrike (Hauts-de-France), 🇬🇧 Storbritannia (MIRA Technology Park), 🇺🇸 USA (Aertssen Logistics — Rincon GA + Tacoma WA).','is':'5 framleiðslustöðvar: Shiyan (Kína), Hépéí (Kína), Port of Antwerp-Bruges (Belgía), Louisiana (Bandaríkin) og Normandí (Frakkland).',
      'sv': 'Windrose har 5 produktionsplatser på 3 kontinenter: 🇧🇪 Belgien (Port of Antwerp-Bruges), 🇨🇳 Kina (Suzhou), 🇫🇷 Frankrike (Hauts-de-France), 🇬🇧 Storbritannien (MIRA Technology Park), 🇺🇸 USA (Aertssen Logistics — Rincon GA + Tacoma WA).',
      'fi': 'Windrosella on 5 tuotantopaikkaa 3 mantereella: 🇧🇪 Belgia (Port of Antwerp-Bruges), 🇨🇳 Kiina (Suzhou), 🇫🇷 Ranska (Hauts-de-France), 🇬🇧 UK (MIRA Technology Park), 🇺🇸 USA (Aertssen Logistics — Rincon GA + Tacoma WA).',
      'da': 'Windrose har 5 produktionssteder på 3 kontinenter: 🇧🇪 Belgien (Port of Antwerp-Bruges), 🇨🇳 Kina (Suzhou), 🇫🇷 Frankrig (Hauts-de-France), 🇬🇧 Storbritannien (MIRA Technology Park), 🇺🇸 USA (Aertssen Logistics — Rincon GA + Tacoma WA).',
      'pl': 'Windrose ma 5 zakładów produkcyjnych na 3 kontynentach: 🇧🇪 Belgia (Port of Antwerp-Bruges), 🇨🇳 Chiny (Suzhou), 🇫🇷 Francja (Hauts-de-France), 🇬🇧 Wielka Brytania (MIRA Technology Park), 🇺🇸 USA (Aertssen Logistics — Rincon GA + Tacoma WA).',
      'it': 'Windrose ha 5 siti produttivi su 3 continenti: 🇧🇪 Belgio (Port of Antwerp-Bruges), 🇨🇳 Cina (Suzhou), 🇫🇷 Francia (Hauts-de-France), 🇬🇧 UK (MIRA Technology Park), 🇺🇸 USA (Aertssen Logistics — Rincon GA + Tacoma WA).',
      'pt': 'A Windrose tem 5 instalações fabris em 3 continentes: 🇧🇪 Bélgica (Port of Antwerp-Bruges), 🇨🇳 China (Suzhou), 🇫🇷 França (Hauts-de-France), 🇬🇧 Reino Unido (MIRA Technology Park), 🇺🇸 EUA (Aertssen Logistics — Rincon GA + Tacoma WA).',
      'ja': 'Windroseは3大陸に5つの製造拠点: 🇧🇪 ベルギー (アントワープ・ブルージュ港)、🇨🇳 中国 (蘇州)、🇫🇷 フランス (オー＝ド＝フランス)、🇬🇧 英国 (MIRAテクノロジーパーク)、🇺🇸 米国 (Aertssen Logistics — リンコンGA + タコマWA)。',
      'ko': 'Windrose는 3대륙에 5개 제조 시설: 🇧🇪 벨기에 (Antwerp-Bruges 항구), 🇨🇳 중국 (Suzhou), 🇫🇷 프랑스 (Hauts-de-France), 🇬🇧 영국 (MIRA Technology Park), 🇺🇸 미국 (Aertssen Logistics — Rincon GA + Tacoma WA).',
      'zh': 'Windrose在3大洲拥有5个制造基地:🇧🇪 比利时(安特卫普-布鲁日港)、🇨🇳 中国(苏州)、🇫🇷 法国(上法兰西大区)、🇬🇧 英国(MIRA技术园)、🇺🇸 美国(Aertssen Logistics — 乔治亚州林肯 + 华盛顿州塔科马)。',
    },
    'service': {
      'en': 'Windrose works with top after-sales partners globally: FleetNet America (US, 65,000 providers), Manheim, Alliance Automotive (France), Relais (Nordics), Raskone (Finland), Team Verkstad (Sweden), Team Verksted (Norway), Xos (US).',
      'fr': 'Windrose collabore avec les meilleurs partenaires après-vente : FleetNet America (USA, 65 000 prestataires), Manheim, Alliance Automotive (France), Relais (Pays nordiques), Raskone (Finlande), Team Verkstad (Suède), Team Verksted (Norvège), Xos (USA).',
      'de': 'Windrose arbeitet weltweit mit führenden After-Sales-Partnern zusammen: FleetNet America (USA, 65.000 Anbieter), Manheim, Alliance Automotive (Frankreich), Relais (Nordics), Raskone (Finnland), Team Verkstad (Schweden), Team Verksted (Norwegen), Xos (USA).',
      'nl': 'Windrose werkt samen met topkwaliteit aftersales-partners wereldwijd: FleetNet America (VS, 65.000 leveranciers), Manheim, Alliance Automotive (Frankrijk), Relais (Scandinavië), Raskone (Finland), Team Verkstad (Zweden), Team Verksted (Noorwegen), Xos (VS).',
      'no': 'Windrose samarbeider med topp ettersalgs-partnere globalt: FleetNet America (USA, 65 000 leverandører), Manheim, Alliance Automotive (Frankrike), Relais (Norden), Raskone (Finland), Team Verkstad (Sverige), Team Verksted (Norge), Xos (USA).','is':'Þjónustunet í 24 löndum. FleetNet America í Bandaríkjunum (800+ staðir), Raskibe í Norðurlöndunum. Windrose Mobile Service er einnig tiltæk.',
      'sv': 'Windrose samarbetar med topp eftermarknadspartner globalt: FleetNet America (USA, 65 000 leverantörer), Manheim, Alliance Automotive (Frankrike), Relais (Norden), Raskone (Finland), Team Verkstad (Sverige), Team Verksted (Norge), Xos (USA).',
      'fi': 'Windrose tekee yhteistyötä huippujälkimarkkinointikumppaneiden kanssa: FleetNet America (USA, 65 000 toimijaa), Manheim, Alliance Automotive (Ranska), Relais (Pohjoismaat), Raskone (Suomi), Team Verkstad (Ruotsi), Team Verksted (Norja), Xos (USA).',
      'da': 'Windrose arbejder sammen med topkvalitets eftersalgs-partnere globalt: FleetNet America (USA, 65.000 udbydere), Manheim, Alliance Automotive (Frankrig), Relais (Norden), Raskone (Finland), Team Verkstad (Sverige), Team Verksted (Norge), Xos (USA).',
      'pl': 'Windrose współpracuje z czołowymi partnerami posprzedażowymi na świecie: FleetNet America (USA, 65 000 punktów), Manheim, Alliance Automotive (Francja), Relais (Skandynawia), Raskone (Finlandia), Team Verkstad (Szwecja), Team Verksted (Norwegia), Xos (USA).',
      'it': 'Windrose collabora con i migliori partner post-vendita a livello globale: FleetNet America (USA, 65.000 fornitori), Manheim, Alliance Automotive (Francia), Relais (Nordics), Raskone (Finlandia), Team Verkstad (Svezia), Team Verksted (Norvegia), Xos (USA).',
      'pt': 'A Windrose trabalha com os melhores parceiros de pós-venda globalmente: FleetNet America (EUA, 65.000 prestadores), Manheim, Alliance Automotive (França), Relais (Países Nórdicos), Raskone (Finlândia), Team Verkstad (Suécia), Team Verksted (Noruega), Xos (EUA).',
      'ja': 'Windroseは世界トップのアフターセールスパートナーと提携: FleetNet America (米国、65,000拠点)、Manheim、Alliance Automotive (フランス)、Relais (北欧)、Raskone (フィンランド)、Team Verkstad (スウェーデン)、Team Verksted (ノルウェー)、Xos (米国)。',
      'ko': 'Windrose는 글로벌 최고의 애프터세일즈 파트너와 협력합니다: FleetNet America (미국, 65,000개 거점), Manheim, Alliance Automotive (프랑스), Relais (북유럽), Raskone (핀란드), Team Verkstad (스웨덴), Team Verksted (노르웨이), Xos (미국).',
      'zh': 'Windrose在全球与顶级售后合作伙伴合作:FleetNet America(美国,65,000个服务点)、Manheim、Alliance Automotive(法国)、Relais(北欧)、Raskone(芬兰)、Team Verkstad(瑞典)、Team Verksted(挪威)、Xos(美国)。',
    },
    'subsidies': {
      'en': 'Available incentives: 🇬🇧 UK ZETG grant up to £81,000. 🇺🇸 US HVIP up to $120,000+ (CARB qualified, California). Other regions: contact sales@windrose.ai for local programs.',
      'fr': 'Aides disponibles : 🇬🇧 subvention UK ZETG jusqu\'à 81 000 £. 🇺🇸 HVIP US jusqu\'à 120 000 $+ (qualifié CARB, Californie). Autres régions : contactez sales@windrose.ai pour les programmes locaux.',
      'de': 'Verfügbare Anreize: 🇬🇧 UK ZETG-Förderung bis zu 81.000 £. 🇺🇸 US HVIP bis zu 120.000 $+ (CARB-qualifiziert, Kalifornien). Andere Regionen: sales@windrose.ai für lokale Programme kontaktieren.',
      'nl': 'Beschikbare incentives: 🇬🇧 UK ZETG-subsidie tot £81.000. 🇺🇸 US HVIP tot $120.000+ (CARB-gekwalificeerd, Californië). Andere regio\'s: neem contact op met sales@windrose.ai voor lokale programma\'s.',
      'no': 'Tilgjengelige insentiver: 🇬🇧 UK ZETG-tilskudd opptil 81 000 £. 🇺🇸 US HVIP opptil 120 000 $+ (CARB-kvalifisert, California). Andre regioner: kontakt sales@windrose.ai for lokale programmer.','is':'Mörg lönd bjóða upp á styrki og skattafríðindi. Hafðu samband við Windrose eða staðbundinn umboðsmann til að fá nákvæmar upplýsingar.',
      'sv': 'Tillgängliga incitament: 🇬🇧 UK ZETG-bidrag upp till 81 000 £. 🇺🇸 US HVIP upp till 120 000 $+ (CARB-kvalificerad, Kalifornien). Andra regioner: kontakta sales@windrose.ai för lokala program.',
      'fi': 'Saatavilla olevat kannustimet: 🇬🇧 UK ZETG -avustus jopa 81 000 £. 🇺🇸 US HVIP jopa 120 000 $+ (CARB-hyväksytty, Kalifornia). Muut alueet: ota yhteyttä sales@windrose.ai paikallisten ohjelmien osalta.',
      'da': 'Tilgængelige incitamenter: 🇬🇧 UK ZETG-tilskud op til £81.000. 🇺🇸 US HVIP op til $120.000+ (CARB-kvalificeret, Californien). Andre regioner: kontakt sales@windrose.ai for lokale programmer.',
      'pl': 'Dostępne zachęty: 🇬🇧 dotacja UK ZETG do 81 000 £. 🇺🇸 US HVIP do 120 000 $+ (kwalifikacja CARB, Kalifornia). Inne regiony: skontaktuj się z sales@windrose.ai w sprawie programów lokalnych.',
      'it': 'Incentivi disponibili: 🇬🇧 sussidio UK ZETG fino a 81.000 £. 🇺🇸 HVIP USA fino a 120.000 $+ (qualificato CARB, California). Altre regioni: contatta sales@windrose.ai per programmi locali.',
      'pt': 'Incentivos disponíveis: 🇬🇧 subsídio UK ZETG até £81.000. 🇺🇸 HVIP US até $120.000+ (qualificado CARB, Califórnia). Outras regiões: contacte sales@windrose.ai para programas locais.',
      'ja': '利用可能なインセンティブ: 🇬🇧 英国ZETG助成金最大81,000 £。🇺🇸 米国HVIP最大120,000 $+ (CARB認証、カリフォルニア)。その他の地域: sales@windrose.aiまで現地プログラムについてお問い合わせください。',
      'ko': '이용 가능한 인센티브: 🇬🇧 영국 ZETG 보조금 최대 £81,000. 🇺🇸 미국 HVIP 최대 $120,000+ (CARB 인증, 캘리포니아). 기타 지역: 현지 프로그램은 sales@windrose.ai로 문의하세요.',
      'zh': '可用激励政策:🇬🇧 英国ZETG补贴最高81,000 £。🇺🇸 美国HVIP最高120,000 $+(CARB认证,加州)。其他地区:请联系sales@windrose.ai了解当地项目。',
    },
    'regulatory': {
      'en': 'Windrose is fully homologated: EU WVTA 2018/858 (27 EU + Norway/Switzerland/Iceland). US FMVSS/49 CFR, EPA ZEV exemption, CARB qualified, all 50 states. China GB/T, MIIT catalog. Chile MTT Decreto 211.',
      'fr': 'Windrose est entièrement homologué : UE WVTA 2018/858 (27 pays UE + Norvège/Suisse/Islande). USA FMVSS/49 CFR, exemption EPA ZEV, qualifié CARB, 50 États. Chine GB/T, catalogue MIIT. Chili MTT Decreto 211.',
      'de': 'Windrose ist vollständig homologiert: EU WVTA 2018/858 (27 EU-Länder + Norwegen/Schweiz/Island). USA FMVSS/49 CFR, EPA-ZEV-Ausnahme, CARB-qualifiziert, alle 50 Staaten. China GB/T, MIIT-Katalog. Chile MTT Decreto 211.',
      'nl': 'Windrose is volledig gehomologeerd: EU WVTA 2018/858 (27 EU + Noorwegen/Zwitserland/IJsland). VS FMVSS/49 CFR, EPA ZEV-vrijstelling, CARB-gekwalificeerd, alle 50 staten. China GB/T, MIIT-catalogus. Chili MTT Decreto 211.',
      'no': 'Windrose er fullt homologert: EU WVTA 2018/858 (27 EU + Norge/Sveits/Island). USA FMVSS/49 CFR, EPA ZEV-fritak, CARB-kvalifisert, alle 50 stater. Kina GB/T, MIIT-katalog. Chile MTT Decreto 211.','is':'Windrose E700 uppfyllir ECE R100 (rafmagn), EU 2019/2144 og FMVSS í Bandaríkjunum. CE-merkt í Evrópu.',
      'sv': 'Windrose är fullt homologerad: EU WVTA 2018/858 (27 EU + Norge/Schweiz/Island). USA FMVSS/49 CFR, EPA ZEV-undantag, CARB-kvalificerad, alla 50 stater. Kina GB/T, MIIT-katalog. Chile MTT Decreto 211.',
      'fi': 'Windrose on täysin hyväksytty: EU WVTA 2018/858 (27 EU-maata + Norja/Sveitsi/Islanti). USA FMVSS/49 CFR, EPA ZEV -vapautus, CARB-hyväksytty, kaikki 50 osavaltiota. Kiina GB/T, MIIT-luettelo. Chile MTT Decreto 211.',
      'da': 'Windrose er fuldt homologeret: EU WVTA 2018/858 (27 EU + Norge/Schweiz/Island). USA FMVSS/49 CFR, EPA ZEV-undtagelse, CARB-kvalificeret, alle 50 stater. Kina GB/T, MIIT-katalog. Chile MTT Decreto 211.',
      'pl': 'Windrose ma pełną homologację: UE WVTA 2018/858 (27 krajów UE + Norwegia/Szwajcaria/Islandia). USA FMVSS/49 CFR, zwolnienie EPA ZEV, kwalifikacja CARB, wszystkie 50 stanów. Chiny GB/T, katalog MIIT. Chile MTT Decreto 211.',
      'it': 'Windrose è completamente omologata: UE WVTA 2018/858 (27 paesi UE + Norvegia/Svizzera/Islanda). USA FMVSS/49 CFR, esenzione EPA ZEV, qualificata CARB, tutti i 50 stati. Cina GB/T, catalogo MIIT. Cile MTT Decreto 211.',
      'pt': 'A Windrose está totalmente homologada: UE WVTA 2018/858 (27 países UE + Noruega/Suíça/Islândia). EUA FMVSS/49 CFR, isenção EPA ZEV, qualificada CARB, todos os 50 estados. China GB/T, catálogo MIIT. Chile MTT Decreto 211.',
      'ja': 'Windroseは完全に型式認証取得済み: EU WVTA 2018/858 (EU 27か国 + ノルウェー/スイス/アイスランド)。米国 FMVSS/49 CFR、EPA ZEV免除、CARB認証、全50州。中国 GB/T、MIITカタログ。チリ MTT Decreto 211。',
      'ko': 'Windrose는 완전히 형식 승인 완료: EU WVTA 2018/858 (EU 27개국 + 노르웨이/스위스/아이슬란드). 미국 FMVSS/49 CFR, EPA ZEV 면제, CARB 인증, 50개 주 전체. 중국 GB/T, MIIT 카탈로그. 칠레 MTT Decreto 211.',
      'zh': 'Windrose已完全获得认证:欧盟WVTA 2018/858(27个欧盟国+挪威/瑞士/冰岛)。美国FMVSS/49 CFR、EPA ZEV豁免、CARB认证、全50州。中国GB/T、工信部目录。智利MTT Decreto 211。',
    },
    'roadmap': {
      'en': 'Gen 2 (2026, available now): 670 km range. Gen 3 (2028): 815 km, 811 kWh battery, oil-cooled motor. Gen 4 (2030): 1,000+ km, 960+ kWh, L4 self-driving, auto-hitch electric trailer. See /roadmap.html.',
      'fr': 'Gen 2 (2026, disponible) : autonomie 670 km. Gen 3 (2028) : 815 km, batterie 811 kWh, moteur refroidi à l\'huile. Gen 4 (2030) : 1 000+ km, 960+ kWh, conduite autonome L4, remorque électrique auto-attelée. Voir /roadmap.html.',
      'de': 'Gen 2 (2026, verfügbar): 670 km Reichweite. Gen 3 (2028): 815 km, 811 kWh Batterie, ölgekühlter Motor. Gen 4 (2030): 1.000+ km, 960+ kWh, L4-autonomes Fahren, Auto-Hitch-E-Anhänger. Siehe /roadmap.html.',
      'nl': 'Gen 2 (2026, beschikbaar): 670 km bereik. Gen 3 (2028): 815 km, 811 kWh batterij, oliegekoelde motor. Gen 4 (2030): 1.000+ km, 960+ kWh, L4 zelfrijdend, auto-koppeling elektrische trailer. Zie /roadmap.html.',
      'no': 'Gen 2 (2026, tilgjengelig): 670 km rekkevidde. Gen 3 (2028): 815 km, 811 kWh batteri, oljekjølt motor. Gen 4 (2030): 1 000+ km, 960+ kWh, L4 selvkjørende, auto-hitch elektrisk tilhenger. Se /roadmap.html.','is':'Næst: E800 (800 km drægni), sjálfkeyrslutækni og hydrógentengi. Sjá vefsíðuna okkar til að fá nýjustu fréttir.',
      'sv': 'Gen 2 (2026, tillgänglig): 670 km räckvidd. Gen 3 (2028): 815 km, 811 kWh batteri, oljekyld motor. Gen 4 (2030): 1 000+ km, 960+ kWh, L4 självkörande, auto-hitch elektrisk släp. Se /roadmap.html.',
      'fi': 'Sukupolvi 2 (2026, saatavilla): 670 km kantama. Sukupolvi 3 (2028): 815 km, 811 kWh akku, öljyjäähdytetty moottori. Sukupolvi 4 (2030): 1 000+ km, 960+ kWh, L4 itseajava, auto-hitch sähköperävaunu. Katso /roadmap.html.',
      'da': 'Gen 2 (2026, tilgængelig): 670 km rækkevidde. Gen 3 (2028): 815 km, 811 kWh batteri, oliekølet motor. Gen 4 (2030): 1.000+ km, 960+ kWh, L4 selvkørende, auto-hitch elektrisk anhænger. Se /roadmap.html.',
      'pl': 'Gen 2 (2026, dostępna): zasięg 670 km. Gen 3 (2028): 815 km, bateria 811 kWh, silnik chłodzony olejem. Gen 4 (2030): 1 000+ km, 960+ kWh, jazda autonomiczna L4, auto-hitch elektryczna naczepa. Zobacz /roadmap.html.',
      'it': 'Gen 2 (2026, disponibile): autonomia 670 km. Gen 3 (2028): 815 km, batteria 811 kWh, motore raffreddato a olio. Gen 4 (2030): 1.000+ km, 960+ kWh, guida autonoma L4, rimorchio elettrico auto-aggancio. Vedi /roadmap.html.',
      'pt': 'Gen 2 (2026, disponível): autonomia 670 km. Gen 3 (2028): 815 km, bateria 811 kWh, motor refrigerado a óleo. Gen 4 (2030): 1.000+ km, 960+ kWh, condução autónoma L4, reboque elétrico auto-engate. Veja /roadmap.html.',
      'ja': '第2世代 (2026年、現在利用可能): 走行距離670 km。第3世代 (2028年): 815 km、811 kWhバッテリー、油冷モーター。第4世代 (2030年): 1,000+ km、960+ kWh、L4自動運転、オートヒッチ電気トレーラー。/roadmap.htmlをご覧ください。',
      'ko': 'Gen 2 (2026년, 출시): 주행거리 670 km. Gen 3 (2028년): 815 km, 811 kWh 배터리, 오일 냉각 모터. Gen 4 (2030년): 1,000+ km, 960+ kWh, L4 자율주행, 자동 연결 전기 트레일러. /roadmap.html 참조.',
      'zh': '第2代(2026年,现已上市):续航670公里。第3代(2028年):815公里、811 kWh电池、油冷电机。第4代(2030年):1,000+公里、960+ kWh、L4自动驾驶、自动挂接电动挂车。详见/roadmap.html。',
    },
    'autonomy': {
      'en': 'Today\'s Windrose has L2 driver assist. By 2030 (Gen 4), the platform will support L4 self-driving — built on a drive-by-wire EPS foundation with proprietary suspension and electric drive axle.',
      'fr': 'Le Windrose actuel dispose d\'une assistance conducteur L2. D\'ici 2030 (Gen 4), la plateforme prendra en charge la conduite autonome L4 — basée sur une direction électrique drive-by-wire avec suspension et essieu électrique propriétaires.',
      'de': 'Der heutige Windrose bietet L2-Fahrerassistenz. Bis 2030 (Gen 4) unterstützt die Plattform L4-autonomes Fahren — auf Basis einer Drive-by-Wire-EPS-Grundlage mit eigener Federung und elektrischer Antriebsachse.',
      'nl': 'De huidige Windrose heeft L2 driver-assist. Tegen 2030 (Gen 4) ondersteunt het platform L4 zelfrijdend — gebouwd op een drive-by-wire EPS-fundament met eigen vering en elektrische aandrijfas.',
      'no': 'Dagens Windrose har L2 førerassistanse. Innen 2030 (Gen 4) vil plattformen støtte L4 selvkjøring — basert på en drive-by-wire EPS-grunnpilar med proprietær fjæring og elektrisk drivaksel.','is':'Windrose þróar L2+ og L3 sjálfkeyrslueiginleika. SAE L4 er í þróun með samstarfsfélögum.',
      'sv': 'Dagens Windrose har L2 förarassistans. Till 2030 (Gen 4) kommer plattformen stödja L4 självkörning — byggd på en drive-by-wire EPS-grund med egen fjädring och elektrisk drivaxel.',
      'fi': 'Nykyisessä Windrosessa on L2-kuljettajan apulinen. Vuoteen 2030 (sukupolvi 4) mennessä alusta tukee L4-itseajamista — drive-by-wire EPS -perustalla, omilla jousituksilla ja sähköisellä vetoakselilla.',
      'da': 'Den nuværende Windrose har L2 førerassistance. I 2030 (Gen 4) vil platformen understøtte L4 selvkørsel — bygget på et drive-by-wire EPS-fundament med egen affjedring og elektrisk drivaksel.',
      'pl': 'Obecny Windrose ma asystenta kierowcy L2. Do 2030 (Gen 4) platforma będzie obsługiwać jazdę autonomiczną L4 — opartą na fundamencie drive-by-wire EPS z autorskim zawieszeniem i elektryczną osią napędową.',
      'it': 'L\'attuale Windrose ha assistenza alla guida L2. Entro il 2030 (Gen 4), la piattaforma supporterà la guida autonoma L4 — basata su una struttura drive-by-wire EPS con sospensione e asse motore elettrico proprietari.',
      'pt': 'O Windrose atual tem assistência ao condutor L2. Até 2030 (Gen 4), a plataforma suportará condução autónoma L4 — construída sobre uma base drive-by-wire EPS com suspensão e eixo elétrico próprios.',
      'ja': '現行のWindroseはL2運転支援を搭載。2030年 (第4世代) までにプラットフォームはL4自動運転をサポート — 独自サスペンションと電動駆動アクスルを備えたドライブバイワイヤEPS基盤上で構築。',
      'ko': '현재 Windrose는 L2 운전자 보조 기능을 갖추고 있습니다. 2030년 (Gen 4)까지 플랫폼은 L4 자율주행을 지원할 예정 — 자체 서스펜션과 전기 구동 차축이 있는 drive-by-wire EPS 기반 위에 구축.',
      'zh': '现款Windrose具备L2驾驶辅助。到2030年(第4代),平台将支持L4自动驾驶——基于线控转向EPS基础架构,配合自主研发的悬挂系统和电驱动桥。',
    },
    'presentation': {
      'en': 'Our full investor presentation is at /presentation.html — a 37-slide overview of technology, deployment, manufacturing, charging, and our 2030 roadmap.',
      'fr': 'Notre présentation investisseurs complète est sur /presentation.html — 37 diapositives couvrant technologie, déploiement, production, recharge et feuille de route 2030.',
      'de': 'Unsere vollständige Investorenpräsentation finden Sie auf /presentation.html — 37 Folien zu Technologie, Einsatz, Produktion, Laden und unserem 2030-Roadmap.',
      'nl': 'Onze volledige investeerderspresentatie staat op /presentation.html — 37 slides over technologie, inzet, productie, laden en onze roadmap tot 2030.',
      'no': 'Vår fullstendige investorpresentasjon finnes på /presentation.html — 37 lysbilder om teknologi, utplassering, produksjon, lading og veikartet vårt mot 2030.','is':'Hlaðaðu niður pressupakka og kynningum á vefsíðunni okkar. Tenging: windrose.ai/about',
      'sv': 'Vår fullständiga investerarpresentation finns på /presentation.html — 37 bilder om teknik, utplacering, produktion, laddning och vår färdplan till 2030.',
      'fi': 'Täydellinen sijoittajaesityksemme on osoitteessa /presentation.html — 37 dian katsaus teknologiaan, käyttöönottoon, valmistukseen, lataukseen ja 2030-tiekarttaan.',
      'da': 'Vores fulde investorpræsentation findes på /presentation.html — 37 slides om teknologi, udbredelse, produktion, opladning og vores 2030-køreplan.',
      'pl': 'Nasza pełna prezentacja inwestorska jest pod /presentation.html — 37 slajdów obejmujących technologię, wdrożenia, produkcję, ładowanie i mapę drogową do 2030.',
      'it': 'La nostra presentazione completa per investitori è su /presentation.html — 37 diapositive su tecnologia, distribuzione, produzione, ricarica e roadmap al 2030.',
      'pt': 'A nossa apresentação completa para investidores está em /presentation.html — 37 slides sobre tecnologia, implantação, produção, carregamento e o nosso roteiro para 2030.',
      'ja': '投資家向け完全プレゼンテーションは/presentation.htmlにて公開 — 技術、展開、製造、充電、2030年ロードマップを網羅した37スライド。',
      'ko': '전체 투자자 프레젠테이션은 /presentation.html에서 확인 — 기술, 배포, 제조, 충전, 2030 로드맵을 다룬 37장 슬라이드.',
      'zh': '我们的完整投资者演示在/presentation.html — 涵盖技术、部署、制造、充电和2030路线图的37页幻灯片。',
    },
    'press': {
      'en': 'Our full press kit is at /press.html — logos, brand colors, executive bios, fact sheet, presentation PDF, and photography. Media inquiries: media@windrose.ai.',
      'fr': 'Notre dossier de presse complet est sur /press.html — logos, couleurs de marque, biographies des dirigeants, fiche d\'information, PDF de présentation et photographies. Contact presse : media@windrose.ai.',
      'de': 'Unser vollständiges Pressekit finden Sie auf /press.html — Logos, Markenfarben, Geschäftsführer-Biografien, Fact Sheet, Präsentations-PDF und Fotografien. Medienanfragen: media@windrose.ai.',
      'nl': 'Onze volledige perskit staat op /press.html — logo\'s, merkkleuren, executive bio\'s, factsheet, presentatie-PDF en fotografie. Mediaverzoeken: media@windrose.ai.',
      'no': 'Vår fullstendige pressepakke finnes på /press.html — logoer, merkefarger, lederbiografier, faktaark, presentasjon i PDF og fotografier. Mediehenvendelser: media@windrose.ai.','is':'Windrose hefur fengið viðurkenningar í TIME100, Forbes og Financial Times. Sjá pressusíðuna okkar.',
      'sv': 'Vår fullständiga presspaket finns på /press.html — logotyper, varumärkesfärger, ledningsbiografier, faktablad, presentations-PDF och fotografier. Mediaförfrågningar: media@windrose.ai.',
      'fi': 'Täydellinen mediapakettimme on osoitteessa /press.html — logot, brändivärit, johdon esittelyt, tietolomake, esitys-PDF ja valokuvat. Mediayhteydet: media@windrose.ai.',
      'da': 'Vores fulde pressekit findes på /press.html — logoer, brandfarver, lederbiografier, faktaark, præsentations-PDF og fotografier. Medieforespørgsler: media@windrose.ai.',
      'pl': 'Nasz pełny press kit jest pod /press.html — logo, kolory marki, biogramy zarządu, fact sheet, PDF prezentacji i zdjęcia. Zapytania medialne: media@windrose.ai.',
      'it': 'Il nostro press kit completo è su /press.html — loghi, colori del brand, biografie dei dirigenti, scheda informativa, PDF di presentazione e fotografia. Richieste media: media@windrose.ai.',
      'pt': 'O nosso kit de imprensa completo está em /press.html — logótipos, cores da marca, biografias executivas, ficha de dados, PDF da apresentação e fotografia. Pedidos de imprensa: media@windrose.ai.',
      'ja': '完全プレスキットは/press.htmlにて — ロゴ、ブランドカラー、経営陣プロフィール、ファクトシート、プレゼンPDF、写真。メディアからのお問い合わせ: media@windrose.ai。',
      'ko': '전체 보도자료 키트는 /press.html에서 확인 — 로고, 브랜드 색상, 임원 약력, 팩트 시트, 프레젠테이션 PDF, 사진. 미디어 문의: media@windrose.ai.',
      'zh': '我们的完整新闻资料包在/press.html — 含徽标、品牌色、高管简介、概况说明书、演示PDF和摄影作品。媒体咨询: media@windrose.ai。',
    },
    'time100': {
      'en': 'Windrose was named in TIME100 Most Influential Companies 2026 (Transportation category, April 29, 2026) — alongside companies like Toyota, BYD, and Waymo.',
      'fr': 'Windrose a été nommé dans TIME100 Most Influential Companies 2026 (catégorie Transport, 29 avril 2026) — aux côtés d\'entreprises comme Toyota, BYD et Waymo.',
      'de': 'Windrose wurde in TIME100 Most Influential Companies 2026 (Kategorie Verkehr, 29. April 2026) aufgenommen — neben Unternehmen wie Toyota, BYD und Waymo.',
      'nl': 'Windrose werd genoemd in TIME100 Most Influential Companies 2026 (categorie Transport, 29 april 2026) — naast bedrijven als Toyota, BYD en Waymo.',
      'no': 'Windrose ble navngitt i TIME100 Most Influential Companies 2026 (transportkategori, 29. april 2026) — sammen med selskaper som Toyota, BYD og Waymo.','is':'Windrose var valin meðal 10 áhrifamest flutningsfyrirtækja ársins 2026 af TIME.',
      'sv': 'Windrose namngavs i TIME100 Most Influential Companies 2026 (transportkategori, 29 april 2026) — tillsammans med företag som Toyota, BYD och Waymo.',
      'fi': 'Windrose nimettiin TIME100 Most Influential Companies 2026 -listalle (liikenneluokka, 29. huhtikuuta 2026) — Toyotan, BYD:n ja Waymon kaltaisten yritysten rinnalla.',
      'da': 'Windrose blev navngivet i TIME100 Most Influential Companies 2026 (transportkategori, 29. april 2026) — sammen med virksomheder som Toyota, BYD og Waymo.',
      'pl': 'Windrose została wymieniona w TIME100 Most Influential Companies 2026 (kategoria Transport, 29 kwietnia 2026) — obok firm takich jak Toyota, BYD i Waymo.',
      'it': 'Windrose è stata nominata in TIME100 Most Influential Companies 2026 (categoria Trasporti, 29 aprile 2026) — accanto ad aziende come Toyota, BYD e Waymo.',
      'pt': 'A Windrose foi nomeada na TIME100 Most Influential Companies 2026 (categoria Transportes, 29 de abril de 2026) — ao lado de empresas como Toyota, BYD e Waymo.',
      'ja': 'WindroseはTIME100 Most Influential Companies 2026 (運輸部門、2026年4月29日) に選出 — トヨタ、BYD、Waymoなどの企業と並んで。',
      'ko': 'Windrose는 TIME100 Most Influential Companies 2026 (운송 부문, 2026년 4월 29일)에 선정 — Toyota, BYD, Waymo와 같은 기업과 함께.',
      'zh': 'Windrose入选TIME100 Most Influential Companies 2026(交通运输类,2026年4月29日)——与丰田、比亚迪和Waymo等公司并列。',
    },
  

    'missions': {
      'en': 'Documented real-world missions: 2,600 km across 5 European countries; 1,383 km CEVA Logistics round-trip in Spain (Nov 2025); 6,000 km transnational run from China to Kazakhstan with 46% CO₂ reduction vs diesel (Apr 2026). All missions completed fully loaded, not laboratory projections.',
      'zh': '已记录的实际运营里程:跨越5个欧洲国家的2,600公里;西班牙CEVA Logistics往返1,383公里(2025年11月);从中国到哈萨克斯坦的6,000公里跨国运输(2026年4月),较柴油车减少46%碳排放。所有任务均满载完成。',
      'de': 'Dokumentierte Realmissionen: 2.600 km durch 5 europäische Länder; 1.383 km CEVA Logistics Rundfahrt in Spanien (Nov 2025); 6.000 km transnationale Fahrt von China nach Kasachstan mit 46% CO₂-Reduktion ggü. Diesel (Apr 2026). Alle Missionen vollbeladen abgeschlossen.',
      'fr': 'Missions réelles documentées : 2 600 km à travers 5 pays européens ; 1 383 km aller-retour CEVA Logistics en Espagne (nov. 2025) ; 6 000 km transnational de Chine au Kazakhstan avec −46% CO₂ vs diesel (avr. 2026). Toutes les missions réalisées en charge complète.',
      'ja': '実証済みの実走行ミッション: ヨーロッパ5か国を横断2,600 km、CEVAロジスティクスのスペイン往復1,383 km (2025年11月)、中国からカザフスタンへの6,000 km国際輸送 (ディーゼル比CO₂46%削減、2026年4月)。すべて満載で完走。',
      'ko': '실증된 실제 운행: 유럽 5개국 2,600 km; CEVA 로지스틱스 스페인 왕복 1,383 km (2025년 11월); 중국에서 카자흐스탄까지 6,000 km 국제 운행 (디젤 대비 CO₂ 46% 감소, 2026년 4월). 모든 운행 만재 완료.',
    },
    'competition': {
      'en': 'In the US: Freightliner eCascadia offers 370 km range (vs our 700 km), day cab only (no sleeper), 90-min CCS charging. Volvo VNR Electric: 443 km, 60–90 min charge. In Europe: Volvo FH Aero Electric matches 700 km but pricing undisclosed; Mercedes eActros 600 (500 km, ~$450K); MAN eTGX (570 km, ~$350K). Windrose leads on range, charging speed (38 min), sleeper availability, and price at $285K.',
      'zh': '美国:Freightliner eCascadia续航370公里(我们700公里)、仅日间驾驶室(无卧铺)、CCS充电90分钟。Volvo VNR Electric:443公里、60-90分钟充电。欧洲:Volvo FH Aero Electric续航700公里但价格未披露;奔驰eActros 600(500公里,约45万美元);MAN eTGX(570公里,约35万美元)。Windrose在续航、充电速度(38分钟)、卧铺和28.5万美元价格上领先。',
      'de': 'USA: Freightliner eCascadia 370 km (vs. unsere 700 km), nur Tagesfahrerhaus, 90 Min CCS. Volvo VNR Electric: 443 km, 60–90 Min. Europa: Volvo FH Aero Electric 700 km (Preis unbekannt); Mercedes eActros 600 (500 km, ~450.000 $); MAN eTGX (570 km, ~350.000 $). Windrose führt bei Reichweite, Ladegeschwindigkeit (38 Min), Schlafkabine und Preis ($285.000).',
      'fr': 'USA : Freightliner eCascadia 370 km (vs nos 700 km), cabine jour uniquement, 90 min CCS. Volvo VNR Electric : 443 km, 60–90 min. Europe : Volvo FH Aero Electric 700 km (prix inconnu) ; Mercedes eActros 600 (500 km, ~450 000 $) ; MAN eTGX (570 km, ~350 000 $). Windrose leader sur autonomie, recharge (38 min), cabine couchette et prix ($285 000).',
      'ja': '米国: eCascadia 370 km (当社700 km)、デイキャブのみ、90分CCS充電。Volvo VNR: 443 km。欧州: Volvo FH Aero 700 km (価格未公開)、メルセデスeActros 600 (500 km、約45万$)、MAN eTGX (570 km、約35万$)。Windrose は航続距離・充電速度 (38分)・スリーパー・価格 ($285,000) で優位。',
      'ko': '미국: eCascadia 370 km (당사 700 km), 데이캡만, 90분 CCS 충전. Volvo VNR: 443 km. 유럽: Volvo FH Aero 700 km (가격 미공개), Mercedes eActros 600 (500 km, ~$450K), MAN eTGX (570 km, ~$350K). Windrose는 항속거리, 충전 속도 (38분), 슬리퍼, 가격 ($285,000)에서 우위.',
    },
    'adas': {
      'en': 'Every E700 includes Level 2+ driver assistance as standard: Autonomous Emergency Braking (AEB), Adaptive Cruise Control with regenerative braking (ACC), 270° Around-View Monitor (AVM), lane-keeping assist, and lane departure warning. Over-the-air (OTA) software updates supported. The platform is designed for Level 4 autonomy by Generation 4 (2030).',
      'zh': '每辆E700标配Level 2+驾驶辅助:自动紧急制动(AEB)、集成再生制动的自适应巡航(ACC)、270°全景监控(AVM)、车道保持辅助和车道偏离预警。支持OTA在线升级。平台设计支持至第四代(2030年)实现L4级自动驾驶。',
      'de': 'Jeder E700 hat serienmäßig Level 2+ Fahrerassistenz: AEB (Notbremsassistent), ACC mit Rekuperation, 270° Rundumsicht (AVM), Spurhalteassistent und Spurverlassenswarnung. OTA-Updates unterstützt. Plattform für Level-4-Autonomie ab Generation 4 (2030) ausgelegt.',
      'fr': 'Chaque E700 inclut en standard l\'assistance conducteur Niveau 2+ : Freinage d\'urgence autonome (AEB), régulateur de vitesse adaptatif avec freinage régénératif (ACC), moniteur 270° (AVM), maintien de voie et avertissement de franchissement. Mises à jour OTA supportées. Plateforme conçue pour l\'autonomie niveau 4 dès la Génération 4 (2030).',
      'ja': '全E700にLevel 2+運転支援を標準装備: 自律緊急制動 (AEB)、回生制動統合型ACC、270°全周モニター (AVM)、車線維持・逸脱警告。OTAソフトウェア更新対応。第4世代 (2030年) までにL4自動運転対応を目指す設計。',
      'ko': '모든 E700에 Level 2+ 운전 보조 기본 탑재: 자율 비상 제동 (AEB), 회생 제동 통합 적응형 크루즈 컨트롤 (ACC), 270° 전방위 모니터 (AVM), 차선 유지 및 이탈 경고. OTA 소프트웨어 업데이트 지원. 4세대 (2030) L4 자율주행 설계 기반.',
    },
    'certifications': {
      'en': 'Windrose holds direct type approvals in 7 markets with 100% test completion: US (30 FMVSS, 112 tests, all 50 states + CARB), EU (53 regulations, 125 tests, all 31 EU/EEA states), Canada (23 CMVSS, 104/106 tests), Australia (43 ADRs, 71 tests), New Zealand (19 regulations, 44 tests), Chile (9 regulations, 11 tests), plus China GB/T/MIIT (50+ standards, 200+ tests). Total footprint: 104 markets (35 direct, 69 indirect) across 5 continents.',
      'zh': 'Windrose在7个市场持有直接型式认证,测试完成率100%:美国(30项FMVSS法规、112项测试、全50州+CARB)、欧盟(53项法规、125项测试、全31个欧盟/欧经区成员国)、加拿大(23项CMVSS、104/106项测试)、澳大利亚(43项ADR、71项测试)、新西兰(19项法规、44项测试)、智利(9项法规、11项测试),以及中国GB/T/MIIT(50+项标准、200+项测试)。总覆盖:5大洲104个市场(35个直接认证、69个间接认可)。',
      'de': 'Windrose besitzt direkte Typgenehmigungen in 7 Märkten mit 100% Testabschluss: USA (30 FMVSS, 112 Tests, alle 50 Bundesstaaten + CARB), EU (53 Vorschriften, 125 Tests, alle 31 EU/EWR-Staaten), Kanada (23 CMVSS, 104/106 Tests), Australien (43 ADR, 71 Tests), Neuseeland (19 Vorschriften, 44 Tests), Chile (9 Vorschriften, 11 Tests), plus China GB/T/MIIT. Gesamt: 104 Märkte auf 5 Kontinenten.',
      'fr': 'Windrose détient des homologations directes dans 7 marchés avec 100% de tests complétés : US (30 FMVSS, 112 tests, 50 États + CARB), UE (53 règlements, 125 tests, 31 États UE/EEE), Canada (23 CMVSS, 104/106 tests), Australie (43 ADR, 71 tests), Nouvelle-Zélande (19 règl., 44 tests), Chili (9 règl., 11 tests), plus Chine GB/T/MIIT. Total : 104 marchés sur 5 continents.',
    },
    'ipo': {
      'en': 'Windrose Electric has filed an S-1 registration statement with the U.S. Securities and Exchange Commission for a proposed listing on the New York Stock Exchange under the ticker symbol "WDRS". For investor inquiries, please email investors@windrose.ai.',
      'zh': 'Windrose Electric已向美国证券交易委员会提交S-1注册说明书,拟在纽约证券交易所以"WDRS"为股票代码上市。投资者咨询请发送邮件至investors@windrose.ai。',
      'de': 'Windrose Electric hat beim U.S. Securities and Exchange Commission eine S-1-Registrierungserklärung für eine geplante Notierung an der New York Stock Exchange unter dem Ticker "WDRS" eingereicht. Investorenanfragen bitte an investors@windrose.ai.',
      'fr': 'Windrose Electric a déposé une déclaration d\'enregistrement S-1 auprès de la Securities and Exchange Commission des États-Unis pour une cotation prévue au New York Stock Exchange sous le symbole "WDRS". Demandes investisseurs : investors@windrose.ai.',
      'ja': 'Windrose Electricは、NYSE上場(ティッカー"WDRS")を目的としたS-1登録届出書を米国証券取引委員会に提出しました。投資家向けお問い合わせ: investors@windrose.ai。',
      'ko': 'Windrose Electric은 뉴욕증권거래소 상장 (티커 "WDRS")을 위한 S-1 등록 신고서를 미국 증권거래위원회에 제출했습니다. 투자자 문의: investors@windrose.ai.',
    },
    'advisory': {
      'en': 'Windrose advisory board: Kevin Fong (co-founder GSR Ventures, ex-Managing Partner Mayfield Fund — $4B AUM); Mikael Karlsson (ex-VP Autonomous Solutions, Volvo Trucks — led Volvo Vera autonomous program); Fredrik Allard (ex-SVP E-Mobility, Scania Group — led Scania\'s electrification, 9,000 employees); Curt Ferguson (Managing Partner Ventech China, ex-President Coca-Cola Greater China & Korea).',
      'zh': 'Windrose顾问委员会:Kevin Fong(GSR Ventures联合创始人,前Mayfield Fund管理合伙人——管理资产40亿美元);Mikael Karlsson(前沃尔沃卡车自动驾驶解决方案副总裁——主导Volvo Vera项目);Fredrik Allard(前斯堪尼亚集团E-Mobility高级副总裁——负责斯堪尼亚电气化,9000名员工);Curt Ferguson(Ventech China管理合伙人,前可口可乐大中华及韩国区总裁)。',
    },
    'fallback': {
      'en': 'Sorry, I\'m having trouble connecting. Please email sales@windrose.ai and our team will respond promptly.',
      'fr': 'Désolé, je rencontre des difficultés de connexion. Veuillez envoyer un e-mail à sales@windrose.ai, notre équipe vous répondra rapidement.',
      'de': 'Entschuldigung, ich habe Verbindungsprobleme. Bitte schreiben Sie an sales@windrose.ai, unser Team antwortet schnell.',
      'zh': '，。 sales@windrose.ai，。',
      'nl': 'Sorry, ik heb verbindingsproblemen. Stuur een e-mail naar sales@windrose.ai, ons team reageert snel.',
      'no': 'Beklager, jeg har tilkoblingsproblemer. Send en e-post til sales@windrose.ai, teamet vårt svarer raskt.','is':'Þakka þér fyrir spurninguna. Windrose sérfræðingur mun svara þér fljótlega. Þú getur einnig haft samband við okkur á windrose.ai',
      'sv': 'Tyvärr har jag anslutningsproblem. Maila sales@windrose.ai, vårt team svarar snabbt.',
      'fi': 'Pahoittelut, minulla on yhteysongelmia. Lähetä sähköpostia osoitteeseen sales@windrose.ai, tiimimme vastaa nopeasti.',
      'da': 'Beklager, jeg har forbindelsesproblemer. Send en e-mail til sales@windrose.ai, vores team svarer hurtigt.',
      'pl': 'Przepraszam, mam problemy z połączeniem. Napisz na sales@windrose.ai, nasz zespół odpowie szybko.',
      'it': 'Scusa, ho problemi di connessione. Invia un\'e-mail a sales@windrose.ai, il nostro team risponderà prontamente.',
      'pt': 'Desculpe, estou com problemas de ligação. Por favor, envie um e-mail para sales@windrose.ai, a nossa equipa responderá rapidamente.',
      'ja': 'しありませんが、にがあります。sales@windrose.aiまでメールをおりください。チームがにします。',
      'ko': '죄송합니다, 연결에 문제가 있습니다. sales@windrose.ai로 이메일을 보내주시면 팀이 신속히 답변 드리겠습니다.',
    },
  };

  // Keyword triggers → FAQ key (language-independent matching)
  window.FAQ_LANGS = FAQ_LANGS;
  window.FAQ_TRIGGERS = window.FAQ_TRIGGERS || [];  // populated below
  var FAQ_TRIGGERS = [
    { key: 'range',    q: [ 'range','how far','km','miles','distance','how long can','how many km','reichweite','portée','autonomia','bereik','rekkevidde','räckvidd','kantama','rækkevidde','zasięg','autonomie',
                           '','','','','','','','','주행거리','','キロ','', '续航', '里程', '航続', '航续'] },
    { key: 'price',    q: ['price','cost','how much','pricing','eur','gbp','usd','aud','euro','pound','dollar','prix','preis','kosten','prijs','pris','hinta','cena','prezzo','preço','afford','tarif','expensive','cheap',
                           '','','','','','','','','','가격','얼마','','いくら','','お', 'costa', 'costo', 'quanto', '价格', '多少钱', '价钱', '价位', '価格', '値段', '料金'] },
    { key: 'lease',    q: ['lease','monthly','finance','instalment','payment plan','per month','monthly payment','leasing','융자','융',
                           '','','','','','','','리스','월납','ファイナンス','い','リース'] },
    { key: 'delivery', q: ['delivery','when','timeline','q3','q4','2026','how soon','lead time','deposit','advance','reservation','book','when can i get','when will','livraison','lieferung','levering','toimitusaika','dostawa','consegna','entrega','aanbetaling',
                           '','','','','','','','','','','납기','배달','언제','','いつ','デポジット', '交付', '何时', '什么时候', '交货', '納期', '配送', '인도'] },
    { key: 'charge',   q: ['charge','charging','fast','mcs','megawatt','ccs','plug','how long to charge','charger','charging time',
                           '','','','','','','충전','','チャージ',''] },
    { key: 'order',    q: [ 'order','buy','purchase','enquire','contact','email','reserve','how to order','how do i buy','commander','bestellen','bestille','beställa','tilata','zamówić','ordinare','encomendar',
                           '','','','','','','','','구매','주문','','','い','どこで', '订购', '购买', '联系', '订单', '注文', '購入'] },
    { key: 'charge', q: ['charge', 'charging', 'mcs', 'megawatt', 'ccs', 'plug', 'how long to charge', 'charger', 'charging time', 'fast charge', 'ladestation', 'aufladen', 'recharge', 'borne', 'opladen', 'lading', 'laddning', 'laddstation', 'lataus', 'opladning', 'ładowanie', 'ricarica', 'carregar', '充电', '充電', '충전'] },
    { key: 'specs', q: ['spec', 'specs', 'specification', 'specifications', 'technical', 'data sheet', 'datasheet', 'spezifikation', 'technique', 'specyfikacja', 'specifiche', 'especificações', '规格', '仕様', '사양'] },
    { key: 'lease', q: ['lease', 'leasing', 'monthly', 'finance', 'financing', 'instalment', 'payment plan', 'per month', 'leasingowanie', 'financement', 'finanziamento', 'financiamento', '租赁', 'リース', '리스'] },
    { key: 'battery', q: ['battery', 'batteries', 'kwh', 'lfp', 'lithium', 'nmc', 'cells', 'akku', 'batterie', 'batería', 'batteria', 'bateria', '电池', 'バッテリー', '배터리'] },
    { key: 'about', q: ['about windrose',  'who is windrose',  'company', 'what is windrose',  'à propos', 'über windrose', 'sobre windrose', 'chi è', '关于', 'について', '회사 소개'] },
    { key: 'founder', q: ['founder', 'ceo', 'wen han', 'who runs', 'who is wen', 'chairman', 'leadership', 'fondateur', 'pdg', 'gründer', 'fundador', 'fondatore', '创始人', '創業者', '창업자'] },
    { key: 'presentation', q: ['presentation', 'deck', 'slides', 'investor deck', 'presentation deck', 'présentation', 'präsentation', 'presentación', 'apresentação', 'presentazione', '演示', 'プレゼン', '프레젠테이션'] },
    { key: 'investors', q: ['investor', 'investors', 'funding', 'backed by', 'backers', 'vc', 'shareholders', 'investisseur', 'investor', 'investitore', 'inversor', 'inwestor', '投资者', '投資家', '투자자'] },
    { key: 'customers', q: ['customer', 'customers', 'client', 'clients', 'who buys', 'who uses', 'fleet operators', 'kunde', 'cliente', 'klant', 'kund', 'asiakas', '客户', '顧客', '고객'] },
    { key: 'countries', q: ['country', 'countries', 'where deployed', 'where operate', 'footprint', 'global presence', 'pays', 'länder', 'paesi', 'países', 'kraje', '国家', '国', '국가'] },
    { key: 'manufacturing', q: ['manufacturing', 'manufacturer', 'factory', 'factories', 'where made', 'made in', 'production', 'assembly', 'plant', 'herstellung', 'fabrication', 'produzione', 'fabbrica', 'produkcja', '制造', '製造', '제조', 'made', 'built'] },
    { key: 'service', q: ['after-sales', 'after sales', 'service', 'support', 'repair', 'maintenance', 'fleetnet', 'workshop', 'wartung', 'manutenzione', 'serviço', '服务', 'サービス', '서비스'] },
    { key: 'subsidies', q: ['subsidy', 'subsidies', 'grant', 'grants', 'incentive', 'incentives', 'hvip', 'zetg', 'carb', 'subvention', 'förderung', 'sussidio', 'subsídio', 'dotacja', '补贴', '補助金', '보조금'] },
    { key: 'regulatory', q: ['regulatory', 'regulation', 'compliance', 'homologation', 'approval', 'approved', 'certification', 'certified', 'wvta', 'fmvss', 'zertifizierung', '法规', '認証', '인증'] },
    { key: 'roadmap', q: ['roadmap', 'future', 'gen 2', 'gen 3', 'gen 4', '2028', '2030', 'next generation', 'generation', 'génération', 'roteiro', '路线图', 'ロードマップ', '로드맵'] },
    { key: 'autonomy', q: ['autonomy', 'autonomous', 'self-driving', 'self driving', 'l4', 'driverless', 'autopilot', 'autonomie', 'self-drive', '自动驾驶', '自動運転', '자율주행'] },
    { key: 'press', q: ['press', 'media', 'press kit', 'logo', 'logos', 'journalist', 'brand', 'presse', 'medien', 'prensa', 'stampa', 'imprensa', '媒体', 'プレス', '미디어'] },
    { key: 'time100', q: ['time100', 'time 100', 'time magazine', 'time award', 'recognition', '时代', 'タイム', '타임'] },
    { key: 'missions',      q: ['mission', 'real world', 'deployment', 'ceva', 'spain', 'kazakhstan', '6000 km', '2600 km', 'documented', 'validated', 'commercial operation', '实际', '任务'] },
    { key: 'competition',    q: ['competitor', 'competition', 'vs ', 'versus', 'compare', 'ecascadia', 'cascadia', 'volvo vnr', 'volvo fh', 'eactros', 'man etgx', 'daf xf', 'better than', 'difference', 'alternative', '竞争', '对比'] },
    { key: 'adas',           q: ['adas', 'driver assist', 'autonomous', 'self-driving', 'aeb', 'emergency braking', 'lane keep', 'cruise control', 'around view', 'avm', 'ota', 'over the air', 'safety feature', 'driver safety', '辅助驾驶', '自动驾驶'] },
    { key: 'certifications', q: ['certification', 'certifications', 'how many tests', 'how many regulations', 'fmvss', 'wvta', 'adr', 'cmvss', 'type approval', 'homologation', 'test procedures', '认证', '型式认证'] },
    { key: 'ipo',            q: ['ipo', 's-1', 's1', 'listing', 'stock', 'shares', 'ticker', 'wdrs', 'nyse', 'public offering', 'invest', 'shareholder', '上市', '股票', '证券'] },
    { key: 'advisory',       q: ['advisory board', 'advisors', 'adviser', 'kevin fong', 'mikael karlsson', 'fredrik allard', 'curt ferguson', 'gsr ventures', 'scania advisor', 'volvo advisor', '顾问'] },
  ];
  window.FAQ_TRIGGERS = FAQ_TRIGGERS;

  function detectLang(q) {
    // Check Japanese kana FIRST so kanji-only Japanese isn't mistaken for Chinese
    if (/[\u3040-\u30ff\u31f0-\u31ff]/.test(q)) return 'ja';
    if (/[\uac00-\ud7a3]/.test(q)) return 'ko';
    if (/[\u4e00-\u9fff]/.test(q)) return 'zh';
    return (typeof currentLang !== 'undefined') ? currentLang : 'en';
  }

  function getFaqReply(q) {
    var lang = detectLang(q);
    var ql = q.toLowerCase();
    for (var i = 0; i < FAQ_TRIGGERS.length; i++) {
      for (var j = 0; j < FAQ_TRIGGERS[i].q.length; j++) {
        if (ql.indexOf(FAQ_TRIGGERS[i].q[j]) !== -1) {
          var key = FAQ_TRIGGERS[i].key;
          return (FAQ_LANGS[key] && FAQ_LANGS[key][lang]) ? FAQ_LANGS[key][lang] : FAQ_LANGS[key]['en'];
        }
      }
    }
    // Smart catch-all: give a general intro in the right language
    var catchAll = {
      'zh': 'Windrose E700，700，€198,000。， sales@windrose.ai 。',
      'ja': 'Windrose E700はをリードするトラックです。の700km、€198,000〜。はsales@windrose.aiまでおいわせいただくか、カードをクリックしてください。',
      'ko': 'Windrose E700는 세계 최고의 전기 장거리 트럭으로, 만재 시 700km 주행 가능하며 유럽 가격은 €198,000부터 시작합니다. 더 많은 정보는 sales@windrose.ai로 문의하거나 가격 카드를 클릭하세요.',
      'fr': 'Le Windrose E700 est un camion électrique longue distance de classe mondiale — 700 km d\'autonomie chargé, à partir de €250 000 en Europe. Contactez sales@windrose.ai ou cliquez sur une carte de prix.',
      'de': 'Der Windrose E700 ist ein weltweit führender Elektro-Lkw — 700 km Reichweite beladen, ab €250.000 in Europa. Kontaktieren Sie sales@windrose.ai oder klicken Sie auf eine Preiskarte.',
      'en': 'The Windrose E700 is a world-leading electric long-haul truck — 700 km loaded range, from €198,000 in Europe. Ask me about range, pricing, charging, delivery timelines, or how to order. Or email sales@windrose.ai.'
    };
    return catchAll[lang] || catchAll['en'];
  }

  function getFallback(q) {
    var lang = detectLang(q || '');
    return (FAQ_LANGS['fallback'] && FAQ_LANGS['fallback'][lang]) ? FAQ_LANGS['fallback'][lang] : FAQ_LANGS['fallback']['en'];
  }

  var SYSTEM_BASE = `You are the customer assistant for Windrose Electric, a global electric long-haul truck company headquartered in Antwerp, Belgium. Be warm and helpful. ALWAYS format every answer as bullet points starting with • — one key fact or step per bullet, never prose paragraphs. Even a single-sentence answer must be a bullet. Keep answers focused (3–6 bullets max). Always respond in {LANGUAGE}.\n\nPRODUCT:\n- Truck: Windrose E700 / Global E700\n- Range: 700 km fully loaded (single trailer at 49 tons), 500 km with double trailer at 64 tons\n- Battery: 705 kWh LFP at 800V — safe, long life. Motor: 1,400 hp (1,045 kW peak)\n- Charging: MCS 870 kW, CCS2, CCS1, GB/T — 38 min charge (20-80%)\n\nPRICING (indicative):\n- EUR: €198,000 excl. taxes — est. €3,900/mo lease\n- GBP: £220,000 excl. VAT — up to £81,000 UK grant — est. £2,200/mo after grant\n- USD: $285,000 excl. taxes — $120,000+ HVIP — est. $3,100/mo after HVIP\n- AUD: A$450,000 excl. GST — est. A$7,200/mo\n- All lease estimates: 5-year term, 20% residual\n\nDELIVERY:\n- Q3 2026: 60% advanced payment required\n- Q4 2026: 5% deposit to reserve, balance due before delivery\n\nCOMPANY:\n- Founded 2022 by Stanford graduate 韩文 (Wen Han)\n- HQ: Antwerp, Belgium — 24 countries, 5 continents\n- Investors: HSBC, Citi, Fountainvest, GSR Ventures, HITE Hedge, Goodman Group\n- Customers: CEVA, Kuehne+Nagel, KLN, Decathlon, Remy Cointreau, Nestle Wyeth, Bluescope, Danske Fragtmaend\n\nORDERING: Email sales@windrose.ai or click any price card. Reserve via Stripe at top of page.\nCHARGING PARTNERS: Milence (EU), ENGIE Vianeo (FR), Kempower (FI/US), EV Realty (US), Greenlane (US), Terawatt (US), Hubject (DE), Autel (NL), Sinexcel (AU), Transport & Energy (UK)\nIf unsure, suggest emailing sales@windrose.ai.

REAL-WORLD MISSIONS (documented, not lab projections):
- 2,600 km across 5 European countries
- 1,383 km round-trip CEVA Logistics, Spain (Nov 2025)
- 6,000 km China→Kazakhstan transnational, 46% CO₂ reduction vs diesel (Apr 2026)

CERTIFICATIONS (direct type approvals, 100% test completion):
- US: 30 FMVSS regulations, 112 tests — all 50 states, CARB ZEV/ACT, HVIP $120K+
- EU: 53 regulations, 125 tests — all 31 EU/EEA member states (EU WVTA 2018/858)
- Canada: 23 CMVSS, 104/106 tests — Transport Canada direct cert
- Australia: 43 ADRs, 71 tests — all states/territories (June 2026)
- New Zealand: 19 regulations, 44 tests — NZTA direct cert
- Chile: 9 regulations, 11 tests — MTT Decreto 211
- China: 50+ GB/T standards, 200+ tests — MIIT + CCC
- Total: 104 markets (35 direct, 69 indirect), 5 continents

TECHNOLOGY:
- ADAS Level 2+ standard: AEB, ACC with regen braking, 270° AVM, lane-keeping, lane departure warning
- OTA software updates; drag coefficient 0.2755; 2 US Design Patents
- Plug&Charge ISO 15118-20 (Hubject) — 1M+ charge points, 70+ countries, no card/app needed

COMPETITION:
- US: eCascadia 370 km, day cab only, 90 min CCS; Volvo VNR 443 km, 60–90 min
- EU: Volvo FH Aero 700 km (price undisclosed); Mercedes eActros 600 500 km ~$450K; MAN eTGX 570 km ~$350K
- Windrose differentiators: 700 km range, 38-min MCS, sleeper cab, $285K USD

IPO: S-1 filed with SEC for NYSE listing ticker \"WDRS\". Investor inquiries: investors@windrose.ai

ADVISORY BOARD: Kevin Fong (GSR Ventures, ex-Mayfield), Mikael Karlsson (ex-Volvo Trucks VP Autonomy), Fredrik Allard (ex-Scania SVP E-Mobility), Curt Ferguson (Ventech China, ex-Coca-Cola Greater China President)

OWNER'S MANUAL — COMPLETE REFERENCE (Windrose E700):
SAFETY AND COMPLIANCE: The Windrose is a battery electric tractor unit. Operators must read the manual before first use and observe all warnings. Do not exceed 19 mph when entering non-motorized vehicle lanes, railroad crossings, sharp bends, narrow roads, bridges, when making U-turns or descending steep grades, in visibility under 164 ft due to fog/rain/snow/dust/hail, on icy/snow/muddy roads, or when towing a disabled vehicle. Never coast downhill in neutral - this removes drive motor braking and may cause loss of control. Replace any seat belt subjected to collision impact. NHTSA contact for US safety defects: 1-888-327-4236 or www.nhtsa.gov. Windrose warranty is voided by unauthorized modifications to high-voltage systems, electrical systems, braking, steering, or TBOX; by OBD tampering; by non-approved parts or fluids; or by failure to service at Windrose authorized centers. Vehicle scrapping and high-voltage battery recycling must be performed by Windrose or authorized recyclers - improper disposal may cause fire or environmental damage. For eco driving: maintain steady speed, avoid harsh acceleration/braking, never coast in neutral as this causes insufficient E-axle lubrication. For winter driving: use coolant with freezing point below local minimum, keep battery fully charged, use snow chains or snow tires, avoid sudden inputs, increase following distance. Snow chains must fit tire size, be fitted to outer tires of drive axle on both sides, and removed on roads without snow. On ramps: if the vehicle rolls back, depress brake and apply EPB immediately; never coast downhill in neutral; on long descents avoid continuous braking to prevent brake fade; avoid sharp steering inputs on downhill roads to reduce rollover risk. Data security: Windrose collects vehicle location, driving behavior, audio/video, and personal information per applicable laws; appropriate technical and organizational measures protect such data. Vehicle modification requires submitting documentation to Windrose including purpose, post-modification gross mass and axle loads, overall dimensions, body floor height, mounting method, and subframe drawing. High-voltage battery recycling must be performed by Windrose or its designated third-party organization only.

VEHICLE OVERVIEW: The vehicle features front indicator/daytime running lamps, high/low beam headlamps, front fog/cornering lamps, front outline marker lamps, side marker combination lamps, and rear combination lamps. The VIN plate is located on the vehicle body; the motor nameplate identifies the drive motor specifications. Interior components include driver and passenger seats, sleeper berths, instrument cluster, and vehicle information screens.

INTERIOR AND COMFORT: The electric sliding door on the right side operates electrically (flush door handle switch), manually, via the B-pillar interior switch, via vehicle information screen Control Center, or via central locking switch. The anti-pinch function is active only during electric closing - not manual operation. Emergency door release uses a cable behind the lower cover plate of the sliding door protection panel. Seat belts fit driver and front passenger; lap belt must lie low across hips not abdomen, shoulder belt across middle of shoulder not neck or under the arm. Never share one belt; replace damaged belts. Power windows operate via instrument panel switches or sleeper panel; one-click lifting is available; windows auto-close when powered off and locked. Panoramic sunroof is fixed/non-operable; the electric sunshade is controlled via the vehicle information screen. The windshield electric sunshade is raised/lowered via switches on the left instrument panel. Interior sleeper has upper and lower berths; the sleeper protection net with 8 tongues must be installed in 8 buckles before use to prevent occupant falls. Rearview mirrors are adjusted via Control Center > Outside; heating/defrost is available and auto-disables at power-off. USB ports are on the left instrument panel and front passenger seat armrest, Type-A and Type-C, 15W maximum. Phone wireless charging is on the right instrument panel at 15W, supports Qi-compatible devices, maximum 1 device at a time; keep metal objects away from the induction area. Power outlets in the sleeper lower left corner: 24V DC max 15A; 12V DC max 10A; 120V AC 1000W rated at 60Hz inverter socket - the 120V inverter only functions when connected to high voltage. The 24V trailer power outlet has a 2 kW maximum safe operating power. Ceiling lamp can be set to activate/deactivate automatically with door open/close. In-vehicle fragrance device mounts below driver seat right trim; bottles insert magnetically; unpacked fragrance lasts 1 year, packed fragrance lasts 3 months; concentration and flavor are adjustable via A/C interface. A/C system controls front and rear zones via vehicle information screen; air volume adjustable 0-7 gears; ECO mode, Auto mode, internal/external circulation, windshield defrost/defog, face/footwell/defrost modes available. Rear A/C also has a dedicated sleeper control panel. Storage: large above-sleeper storage box holds maximum 55.1 lb; small box holds maximum 33.1 lb.

CHARGING AND PRE-DRIVE: Charging ports are on both sides of the vehicle; unlock via Control Center > Outside > Charging Port Unlock. Charging requires a device with voltage at or above 1000V - devices below this standard cannot charge the vehicle. Insert the charging plug until a "click" confirms connection; the electronic lock activates when charging starts. Charging indicators on top of windshield: below 30% SOC left indicator flashes; 30-90% SOC left indicator stays on; above 90% SOC left and middle on plus right flashing; 100% all three on. SOC below 20% triggers a low SOC alarm; below 5% the vehicle enters power limit mode with speed reduction. The battery operates best at 50-86 degrees F; charge once every half month if unused for extended periods. Emergency charging port unlock: push the unlocking mechanism from parallel to perpendicular to the vehicle forward direction. Pre-drive checklist: verify connections and fastening, motor and E-axle noise, accessories, oil levels in E-axle and steering tank, washer fluid and coolant levels, lubrication points, brake and steering function, electrical equipment, tire pressure, and driver tools. Driver seat adjustments: fore-and-aft, armrest height, backrest angle, 90-degree rotation, electric fore-and-aft, height, tilt, damping, heating (High/Medium/Low), massage (Level 1 bottom-to-top, Level 2 lower regional, Level 3 upper regional), lumbar support up/down, and ventilation (High/Medium/Low). NFC Card unlocks by swiping on flush door handle (1 flash = unlocked, 2 flashes = locked); powers on by swiping on right instrument panel NFC area; powers off by swiping or via screen Control Center > Setting > Power OFF. Mechanical key: press front of flush door handle, pull handle out, insert key in hole below handle and rotate right. Steering wheel: pull handle to unlock, adjust height and fore-aft distance, push handle to lock; never adjust while driving.

INSTRUMENT CLUSTER AND CONTROLS: Instrument cluster displays: trip, estimated driving range, odometer, exterior temperature, driving mode, high-voltage battery SOC, current speed, vehicle ready status, current gear, energy recovery level, instantaneous power proportion, instantaneous power per 100 miles, and average power per 100 miles. Day/Night/Auto display modes selectable. Key warning lamps include: direction indicators (left/right/trailer), high beam, low beam, rear fog, front fog, seat belt reminder, low brake pressure, low washer fluid, tire pressure, LCC status, vehicle system fault, maintenance due, door open, mirror heating on, trailer ABS fault, brake shoe wear, ECAS fault, abnormal body height, steering system fault, AUTOHOLD on, HSA working, high-voltage battery fault/cut-off/low SOC, insulation fault, speeding, charging connection, drive motor fault, and TCU fault. Wiper control via left combination switch: hold washing button for continuous wash and wipe; low-speed continuous; high-speed continuous; auto wiping (sensitivity adjustable via screen); off; intermittent (frequency adjustable via screen). Light switch: activate via Control Center > Lighting (position lamp, low beam, or AUTO); light stalk forward = high beam on, backward = off; backward release = passing flash; stalk down = left turn, up = right turn. Daytime running lamps activate automatically when vehicle starts if low beam is off. Hazard warning lamp switch on right instrument panel; indicator flashes when active; use only in emergency conditions. Power ON: unlock vehicle, open door, swipe NFC Card on right instrument panel. Power OFF with EPB engaged: swipe NFC Card on right instrument panel, or via Control Center > Setting > Power OFF on right screen. Service brake: release accelerator first for deceleration; progressively depress brake to stop then switch to N and apply EPB; depress forcefully for emergency. EPB: manual release requires brake pedal pressed then EPB switch pressed; auto-releases on startup in D gear (not R); manual parking brake engagement by pulling EPB switch up. Temporary parking: press Temporary Parking Switch or hold brake pedal for 3+ seconds. EPB emergency braking if service brakes fail: pull up EPB switch slowly; system applies full parking brake when speed reaches 3 mph. Towing mode EPB release: hold EPB switch, tap Power OFF on screen (not via card), hold for 5+ seconds, release - EPB stays released after power-off. Emergency EPB release: power on and press EPB switch 5 times within 10 seconds of power-on. Shift: R gear requires stationary vehicle, brake pedal depressed, lever pushed up; N gear from R requires lever pushed down 1 gear held 1 second; D gear requires stationary vehicle, brake pedal depressed, lever pushed down; power off only in N gear. Regenerative braking: left KERS paddle decreases intensity, right KERS paddle increases intensity; levels 0-5 shown in lower right of instrument cluster; level 0 turns off regeneration; active when battery SOC below 95%. AR-HUD (optional): projects lane departure lines, navigation arrows, speed/mode, warning icons, ACC status onto windshield; adjustable brightness, height, display content via screen. Differential lock: engage only on slippery/muddy roads or heavy climbs; do not engage above 3 mph; do not turn while locked; release immediately after poor road conditions. Driving modes: ECO (lowest energy demand; auto-engages below 10% SOC), Normal (balanced power/economy for daily use), Power (maximum output torque and fastest motor response).

ADAS SYSTEMS: AVM (Around View Monitor): cameras stitch 2D/3D 270-degree panoramic view; accessible via Home > AVM on screen or automatically in R gear; parking assist provides distance-based warnings during reversing. MOIS (Moving Off Information System): monitors pedestrians/cyclists in front blind spots at low speeds; visual-only alarm when stationary, visual plus audible when moving forward; auto-shuts down below 15 lux ambient light; controlled via Control Center > ADAS > MOIS. ACC (Adaptive Cruise Control): maintains set speed on clear roads or follows preceding vehicle at set following distance (5 levels; default level 3 at first power-on); scroll wheel up/down adjusts speed 1 mph per tap or 3 mph per hold; scroll wheel left/right adjusts following distance. ACC exits immediately if any door opens, seat belt unfastened, not in D gear, brake depressed, EPB applied, system not powered, ESC off, wheel speed invalid, speed out of range, AEB activates, or radar/camera blocked. ACC best suited to dry highways; not recommended for city streets. Low speed alarm device emits "ding-ding-ding" at low speed; "beep-beep-beep" in reverse. AEB (Automatic Emergency Braking): safe distance alarm (green display), Level 1 warning (yellow, low-frequency buzzer), Level 2 warning (red, high-frequency buzzer), then automatic brake application if driver takes no action; on by default; cannot detect oncoming/crossing vehicles, animals, traffic lights, or walls; ESC/EBS must be functional for AEB to work. EBS (Electronic Braking System): upgraded ABS/ESC system reducing brake response time and pressure build time; integrates ASR/HSA/ESC; yellow EBS lamp illuminates on fault. EBD (Electronic Brakeforce Distribution): regulates front/rear braking force for different load conditions, controls rear wheel slip for stability. ASR (Acceleration Slip Regulation): brakes slipping drive wheels during acceleration/startup to maintain directional stability; deactivated when ESC is turned off. LDW (Lane Departure Warning): operates at 37-75 mph; visual and audible alert when vehicle drifts from lane without intentional steering input; enabled by default; controlled via Control Center > ADAS > LDW; ineffective on roads without lane lines or in poor visibility. ESC (Electronic Stability Control): brakes individual wheels to correct oversteer/understeer; reduces motor torque or brakes to prevent rollover; on by default; turning off ESC also disables ASR. BSIS (Blind Spot Information System): detects pedestrians and cyclists in side blind spots; Level 1 yellow warning when cyclist at 3-12 mph enters detection area; Level 2 red warning plus audible alarm when vehicle is in forward gear with turn indicator active on target side; controlled via Control Center > ADAS > BSIS Alarm Sound. ADDW (Driver Distraction Warning System): warns when driver is distracted; can be turned off for the current power-on period. ISA (Intelligent Speed Assistance): uses front camera and offline maps to detect speed limit signs within 164 ft ahead and up to 23 ft height; flashes and sounds alarm when vehicle speed exceeds perceived speed limit; releasing accelerator or braking cancels audible warning; can be fully turned off via Control Center > ADAS > ISA. HSA (Hill Start Assist): prevents rollback on slopes; holds vehicle stationary after brake pedal release; driver must start within 3 seconds; off by default at startup; HSA indicator illuminates when active, flashes rapidly before deactivation. TESD (Tire Emergency Safety Device): passive safety device on front wheels preventing wheel hub from contacting ground during blowout to maintain steering and braking control; remove before tire replacement; reinstall with new bolts and nuts only. EHPS (Electro-Hydraulic Power Steering): speed-dependent steering assistance (more assist at low speed, less at high speed); active steering alignment after turns; hands-off detection (HOD) function; contact service center immediately on fault. ECAS (Electronically Controlled Air Suspension): remote control adjusts front/rear/lift axles independently with memory heights M1 and M2; vehicle information screen allows High/Standard/Low selection; High raises airbag 1.97 in; Low lowers 1.38 in from standard; front/rear airbag maximum raise 3.35 in, maximum lower 1.97 in; manual button control disabled above 6 mph; ECAS auto-returns to standard height when speed exceeds 6 mph if not at standard. TPMS (Tire Pressure Monitoring System): displays real-time tire pressure and temperature in Control Center > Monitoring; warning lamp plus popup and audible alert for abnormal pressure/temperature, sensor loss, or rapid leak. Multimedia: center display with radio, local music, phone interconnection, Bluetooth phone, application center; screen modes include screen cleaning, quiet enjoyment, and wait. Warning triangle placement: regular roads 164-328 ft from vehicle; expressways 492 ft; in rain/fog/snow 656.2 ft. Safety hammer stored on right side of sliding door; strike window corners/edges with pointed tip to break; use sleeper protection net as escape rope.

EMERGENCY PROCEDURES: Fire extinguisher is located at lower left of the sleeper. For towing/rescue: install tow hook in front left or right mounting holes screwed fully in with no shaking; keep vehicle powered for steering and braking; turn on hazard lamps; maximum tow speed is 9 mph to prevent motor damage; disconnect trailer before towing; do not tow laterally in mud or soft dirt. Brake failure: activate hazard lamps, hold steering wheel firmly, slowly apply EPB using a spot-brake technique (do not lock all at once), use runaway truck lanes if available; do not immediately apply emergency brakes as this may cause sideslip or rollover. Steering failure on straight roads: release accelerator, activate hazards, apply brakes evenly; do not emergency brake immediately. On curves/mountains: release accelerator immediately, apply brakes quickly. Tire burst: hold steering wheel firmly, activate hazards, release accelerator, repeatedly and lightly depress brake, maintain straight line, then pull over safely when speed is reduced. Vehicle sideslip: release accelerator, turn wheel slightly toward slipping side and return; if sideslip is caused by braking, release brake immediately; do not brake and steer simultaneously; stabilize vehicle before applying intermittent braking. Accidental high-voltage power-off while driving: press hazard switch, try to restart; if unsuccessful, pull over using inertia force. Emergency evacuation when doors cannot open: pull emergency ring behind cover above left net bag to break left window glass; connect sleeper protection net to left side wall fixed point and use as escape rope to exit. Rescue personnel PPE requirements: Class 0 insulating gloves (1000V rated), impact-rated safety goggles, insulated tools rated for high-voltage, insulating rescue hooks, fire extinguisher rated for lithium battery fires; buddy system mandatory with one person supervising while other works; remove all metal jewelry before rescue operations. High-voltage system locations: battery under floor, right CCS1 charging port, left MCS charging port, orange high-voltage harness, drive motor. High-voltage cutoff from outside: park, apply EPB, pull hood release handle twice, remove low-voltage MSD from engine compartment. High-voltage cutoff from inside: park, apply EPB, open lower-left instrument panel trim, disconnect low-voltage MSD. In a vehicle collision the high-voltage system deactivates automatically. For vehicle fire: use dry powder/CO2/dry sand extinguisher for small fires; large fires or deformed/leaking battery require large continuous volumes of water; move all combustibles away from burning vehicle; inform emergency services the vehicle is a BEV with high-voltage battery presenting electric shock, chemical, and thermal runaway risks. Wading rescue: vehicle may have hidden high-voltage damage even without visible external damage; rescuers must wear full PPE; allow vehicle to dry completely before any further work.

MAINTENANCE: Routine and scheduled maintenance is essential; all scheduled maintenance recommended at Windrose authorized service centers. SOC calibration procedure (monthly and after 3+ weeks storage): discharge to 20-25% SOC, charge fully, then discharge to 40-60% SOC. High-voltage battery is under the vehicle floor; avoid collisions on bumpy roads. If battery catches fire in crash: below 12 mph sliding door auto-unlocks; below 4 mph sliding door auto-opens; if driver does not decelerate within 4 minutes the system decelerates and stops automatically. Service mode switches (for inspection/filling only, must stay closed during normal driving): speed limit test, motor coolant pump, battery coolant pump, left/right battery pack compressor, active grille shutter. Lighting self-test: Control Center > Monitoring > Driving Light Self-Test illuminates all lamps simultaneously for inspection. Coolant inspection: check level between MIN and MAX marks; replace immediately if suspended matter, sediment, or discoloration is present; check freezing point regularly. Coolant filling: add slowly to MAX level, run water pump 10 minutes with vehicle powered on, power off and top to MAX, tighten cap; keep motor and room temperature at or below 113 degrees F during filling; rinse system minimum 3 times when first adding or draining; never mix different coolant types. Tire maintenance: replace after 6 years of service; wait for tires to cool before inflation/deflation; check tread depth, foreign objects, cracks, dents, and shoulder wear. Steering system: check free travel and looseness before each drive; shake steering wheel to confirm lock; heavy steering, shaking, or offset requires immediate service. High-voltage safety maintenance: only trained and qualified personnel may perform high-voltage work; remove metal jewelry; use insulated tools; disconnect low-voltage MSD before high-voltage component work; buddy system mandatory. Low-voltage battery: located in engine compartment; keep terminals clean and dry; apply acid-proof grease to clamp lower ends; use commercial detergent for corroded parts; battery electrolyte is corrosive - rinse eyes/skin immediately with water.

SPECIFICATIONS: Vehicle dimensions: length 318.90 in, width 100.20 in, height 154.33 or 154.92 in, wheelbase 183.07 + 53.15 in. Drive motor model TZ230XSSW001: rated 228 hp at 6494 rpm; maximum torque 405.7 lb-ft at 4514 rpm; water-cooled; rear-mounted. LFP high-voltage battery: 705.2 kWh, 4 packs, DC charging at 920A and 868.7V, liquid-cooled. E-axle: Hande HDE10t transaxle, AMT operation; maximum output torque 25,814.7 lb-ft (3-motor) or 31,715.2 lb-ft (4-motor). Tire inflation pressures: 295/80R22.5 at 130.5 psi all positions; 315/70R22.5 at 130.5 psi; 12R22.5 at 134.9 psi. Standard rim 9.00x22.5; 385/65R22.5 uses 11.75x22.5. Wheel alignment: kingpin inclination 7.9 degrees +/-45 arcmin; wheel camber 0.25 degrees +/-45 arcmin; toe-in -0.04 to 0.08 in. Air reservoir: rated working pressure 174.0 psi, starting pressure 108.8 psi; air compressor max cut-off pressure 1.25 MPa; minimum design pressure for service brake 0.6 MPa. Gradability at GVW 46t - D1 gear (below 7 mph): 3-motor continuous 15% max 30% for 60s; 4-motor continuous 17% max 33% for 60s; D2 gear: 3-motor continuous 5% max 9%; 4-motor continuous 6% max 12%. Gradability at GVW 68t - D1 gear: 3-motor continuous 9% max 20%; 4-motor continuous 11% max 22%; D2 gear: 3-motor continuous 3% max 6%; 4-motor continuous 4% max 8%. Key fastening torques: slave rocker arm to subframe M14x2 at 154.9+/-14.8 lb-ft; tie rod ball joint M24x1.5 at 254.5+/-11.1 lb-ft; EHPS to subframe M20x1.5 at 405.7+/-14.8 lb-ft. Curb weights: LFP 3-motor 26,623.2 lb; LFP 4-motor 26,953.9 lb; maximum total mass 57,320.1 lb; 6x4 drive mode. Lamp power: headlamp high beam 32W, low beam 40W; daytime running lamp 14W; front indicator 14W; parking lamp 6.6W; ceiling lamp 9.5W; sleeper reading lamp 1.3W; ambient lamp 0.4W; rear working lamp 9W.

STEERING WHEEL CONTROLS: Left scroll wheel: left/right = adjust ACC following distance (5 levels, default level 3); up/down = increase/decrease cruise speed (1 mph per tap, 3 mph per hold); press center = confirm. Right scroll wheel: up/down = volume up/down; left/right = previous/next track; press = confirm selection. ACC button: press to activate adaptive cruise control; press again to deactivate. LCC button (Lane Centering Control): press to activate lateral lane-centering assist; keeps vehicle centered within lane markings at highway speeds; requires ACC active and clear lane lines; LCC status indicator on instrument cluster; deactivate via same button or steering wheel input. Left KERS paddle: decreases regenerative braking intensity (5→0). Right KERS paddle: increases regenerative braking intensity (0→5). Bluetooth phone button: press to answer; press and hold to hang up or initiate call. Mute: press to mute audio; press again to restore. MODE: cycles radio/music/video sources. Return: returns to previous vehicle information screen. Horn: press center of steering wheel.

ADDITIONAL FEATURES: Side toolbox (left exterior): unlock via Control Center > Outside > Toolbox Unlock; interior lamp auto-activates when opened; close manually from outside; keep closed while driving. Seat belt cleaning: mild soap and water on soft cloth only; air dry; never bleach, machine-wash, or wring. Sleeper privacy curtains: draw across for privacy and sun blocking; do not pull with excessive force. Sleeper reading lamps: pull front end to illuminate; push back to turn off; adjustable angle. Ambient lamps: multiple colors via Control Center > Lighting > Ambient Light; musical rhythm mode available; ensure selected color does not interfere with driving visibility. Follow-me-home lighting: keeps low beam on briefly after exit; configurable duration via Control Center > Lighting. Cup holders: on left/right instrument panel and front passenger armrest; use only securely-lidded containers. In-vehicle fragrance: concentration and flavor adjustable via Control Center > A/C; fragrance bottle installs magnetically; ceramic core must not contact plastic housing.

SERVICE MANUAL — TECHNICAL REFERENCE (WH12 Series, US EPA/CARB):
VEHICLE IDENTIFICATION: VIN is 17 digits. Positions 1-3: WEA (World Manufacturer Identifier). Position 4: series (4=WH12). Position 5: cab type (R=sleeper). Position 6: drive axle (A=6x4, B=8x4). Position 7: motor config (C=3-motor, D=4-motor). Position 8: battery type (F=LFP). Position 9: check digit. Position 10: model year. Position 11: plant code. Positions 12-17: serial number.

VEHICLE WEIGHTS: LFP 3-motor curb weight 26,092 lb; LFP 4-motor 26,433 lb. GVWR 55,116 lb. Maximum total mass 57,320 lb.

FLUID CAPACITIES: Final drive (E-axle) GL-5 75W/90 gear oil; motor cooling system ethylene glycol-based antifreeze down to −45°C (−49°F); battery cooling system uses dedicated battery coolant; EHPS (electro-hydraulic power steering) ATF3 fluid, capacity 4 liters; A/C refrigerant HFC-134a, charge 850 g ± 50 g.

MAINTENANCE SCHEDULE: First maintenance at 10,000 km or 3 months (whichever comes first); thereafter every 20,000 km or 6 months for routine checks; every 40,000 km or 12 months for coolant, brake fluid, and filters; every 80,000 km or 24 months for transmission fluid and drivetrain; every 160,000 km or 48 months for major drivetrain components. All scheduled maintenance recommended at Windrose authorized service centers.

FIRST MAINTENANCE (10,000 km / 3 months) — 12 system categories: (1) High-voltage battery: check SOC, inspect mounting, test BMS; (2) Drive motor: inspect mounting bolts, check cooling, test output; (3) E-axle: check oil level and leaks; (4) Braking: inspect pad thickness, disc runout, caliper function; (5) Steering: check free travel, fluid level, EHPS function; (6) Suspension: inspect air springs, linkages, ride height; (7) Electrical: test all lights, check harness routing, inspect connectors; (8) Cooling: check coolant level, inspect hoses and connections; (9) A/C: check refrigerant charge, inspect belt, test blower; (10) Tires: check pressure and tread depth, rotate if needed; (11) ADAS sensors: clean radar and camera lenses, verify calibration; (12) Chassis: inspect frame, cross-members, fastener torques.

KEY FASTENER TORQUES: Slave rocker arm to subframe M14×2: 154.9 ± 14.8 lb-ft. Tie rod ball joint M24×1.5: 254.5 ± 11.1 lb-ft. EHPS to subframe M20×1.5: 405.7 ± 14.8 lb-ft. Wiper motor mounting M8: 18.5 ± 2 lb-ft.

MECHANICAL FAULT DIAGNOSIS — KEY POINTS: Heavy or unresponsive steering → check EHPS fluid level, power supply, and pump pressure; inspect for air in system. Brake pulling to one side → inspect caliper for seizure, check pad wear balance, verify ABS sensor function. Abnormal tire wear: center wear = over-inflation; edge wear = under-inflation; one-sided wear = misalignment. Vehicle vibration at speed → check wheel balance, inspect hub bearings, verify driveshaft balance. Chassis noise → inspect air suspension components, check all mounting bolt torques.

A/C REFRIGERANT SERVICE: (1) Connect manifold gauge set to service ports. (2) Recover existing refrigerant with approved recovery equipment — never vent to atmosphere. (3) Evacuate system for minimum 30 minutes to 500 microns. (4) Verify vacuum holds for 5 minutes. (5) Charge with HFC-134a to 850 g ± 50 g. Overcharging causes high-pressure cutout and compressor damage.

HIGH-VOLTAGE POWER-DOWN (from outside): (1) Park on level surface and apply EPB. (2) Pull hood release handle twice to open hood. (3) Remove low-voltage MSD from engine compartment. Wait minimum 5 minutes before touching HV components. HIGH-VOLTAGE POWER-DOWN (from inside): (1) Park and apply EPB. (2) Open lower-left instrument panel trim. (3) Disconnect low-voltage MSD inside cab. Mandatory PPE for HV work: Class 0 insulating gloves (1000V rated), safety goggles, insulated tools, buddy system — no metal jewelry.

VEHICLE LIFTING: Use only designated lift points on the frame rails. Never lift under battery pack, air tanks, or suspension components. Minimum jack capacity 15 tons per axle end. Place jack stands before working under vehicle. Chock wheels on opposite axle.

TECHNICAL ABBREVIATIONS: BTMS=Battery Thermal Management System; CMS=Charging Management System; VTDR=Vehicle Travel Data Recorder; T-GW=Telematics Gateway; AVAS=Acoustic Vehicle Alerting System; UDS=Unified Diagnostic Services; IVI=In-Vehicle Infotainment; IPC=Instrument Panel Cluster; ESCL=Electronic Steering Column Lock; IBS=Intelligent Battery Sensor; VDC=Vehicle Dynamic Control; MCU=Motor Control Unit; TCU=Transmission Control Unit; BDCU=Battery Disconnect Control Unit; LFP=Lithium Iron Phosphate (battery chemistry); BSD=Blind Spot Detection; DOW=Door Opening Warning; TSR=Traffic Sign Recognition.`;

  window.wrChatToggle = function() {
    open = !open;
    var panel = document.getElementById('wr-chat-panel');
    panel.style.display = open ? 'flex' : 'none';
    if (open) {
      document.getElementById('wr-chat-input').focus();
      document.body.classList.add('wr-chat-open');
    } else {
      document.body.classList.remove('wr-chat-open');
      // Clear anchored-to-searchbar positioning so next open via floating btn uses default position
      if (panel.dataset.anchored) {
        ['top','left','right','bottom','width','max-height'].forEach(function(p) { panel.style.removeProperty(p); });
        delete panel.dataset.anchored;
      }
    }
  };

  window.wrAsk = function(q) {
    document.getElementById('wr-chat-input').value = q;
    window.wrSend({ preventDefault: function() {} });
  };

  // Unified entry point — called by the search bar AI button and Enter key in unified-search.js.
  // Opens the chatbot panel anchored directly below the search box.
  window.gsAskAI = function() {
    var gsi = document.getElementById('gs-input');
    var q = gsi ? gsi.value.trim() : '';
    if (window.gsClose) window.gsClose();
    var panel = document.getElementById('wr-chat-panel');
    if (!panel) return;
    // On desktop/tablet, anchor the panel below the search bar, centered horizontally
    var gsWrap = document.getElementById('gs-wrap');
    if (gsWrap && window.innerWidth >= 640) {
      var rect = gsWrap.getBoundingClientRect();
      var panelW = Math.min(600, window.innerWidth - 20);
      var left = Math.round((window.innerWidth - panelW) / 2);
      panel.style.setProperty('top', Math.round(rect.bottom + 6) + 'px', 'important');
      panel.style.setProperty('left', left + 'px', 'important');
      panel.style.setProperty('right', 'auto', 'important');
      panel.style.setProperty('bottom', 'auto', 'important');
      panel.style.setProperty('width', panelW + 'px', 'important');
      panel.style.setProperty('max-height', 'calc(100vh - ' + Math.round(rect.bottom + 20) + 'px)', 'important');
      panel.dataset.anchored = '1';
    }
    if (panel.style.display !== 'flex') wrChatToggle();
    if (q) wrAsk(q);
  };

  // Map suggestion chip categories to actual question text
  window.wrAskChip = function(category) {
    var questions = {
      'range':  'What is the range of the Windrose E700?',
      'price':  'How much does the Windrose E700 cost?',
      'charge': 'How fast does the Windrose E700 charge?',
      'order':  'How do I order a Windrose E700?',
      'about':  'Tell me about Windrose Electric.'
    };
    var q = questions[category];
    if (q) { window.wrAsk(q); }
  };

  // STRICT FAQ — only returns an answer if a trigger keyword actually matched.
  // Returns null if no match (so we know to call the API).
  function getStrictFaqReply(q) {
    var lang = detectLang(q);
    var ql = q.toLowerCase();
    for (var i = 0; i < FAQ_TRIGGERS.length; i++) {
      for (var j = 0; j < FAQ_TRIGGERS[i].q.length; j++) {
        var trigger = FAQ_TRIGGERS[i].q[j];
        if (!trigger || trigger.length <= 1) continue;
        var idx = ql.indexOf(trigger);
        if (idx === -1) continue;
        // For ASCII keywords, require word boundary at end (and at start unless start-of-string)
        var lastChar = trigger.charCodeAt(trigger.length-1);
        if (lastChar >= 97 && lastChar <= 122) {
          var endIdx = idx + trigger.length;
          if (endIdx < ql.length) {
            var nextCode = ql.charCodeAt(endIdx);
            // If next char is letter/digit (ASCII), reject the match
            if ((nextCode >= 97 && nextCode <= 122) || (nextCode >= 48 && nextCode <= 57)) continue;
          }
          if (idx > 0) {
            var prevCode = ql.charCodeAt(idx-1);
            if ((prevCode >= 97 && prevCode <= 122) || (prevCode >= 48 && prevCode <= 57)) continue;
          }
        }
        var key = FAQ_TRIGGERS[i].key;
        return (FAQ_LANGS[key] && FAQ_LANGS[key][lang]) ? FAQ_LANGS[key][lang] : (FAQ_LANGS[key] && FAQ_LANGS[key]['en']);
      }
    }
    return null;
  }

  window.wrSend = async function(e) {
    e.preventDefault();
    var input = document.getElementById('wr-chat-input');
    var q = input.value.trim();
    if (!q) return;
    input.value = '';

    document.getElementById('wr-chat-suggestions').style.display = 'none';
    addMsg(q, 'user', false);
    convHistory.push({ role: 'user', content: q });

    var typing = addMsg('…', 'bot typing', false);
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';

    // Override: if the user typed Chinese/Japanese/Korean characters, detect from the message itself
    if (/[\u4e00-\u9fff]/.test(q)) lang = 'zh';
    else if (/[\u3040-\u30ff]/.test(q)) lang = 'ja';
    else if (/[\uac00-\ud7a3]/.test(q)) lang = 'ko';

    // HYBRID: try strict FAQ match first — answers instantly without API call
    var instantReply = getStrictFaqReply(q);
    if (instantReply) {
      typing.remove();
      addMsg(instantReply, 'bot', false);
      convHistory.push({ role: 'assistant', content: instantReply });
      addRelated(q);
      return;
    }

    var langName = LANG_NAMES[lang] || 'English';
    var system = SYSTEM_BASE.replace('{LANGUAGE}', langName);

    try {
      var res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          system: system,
          messages: convHistory
        })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      // Check for Anthropic API error in response body
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
      var reply = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : null;
      if (!reply) throw new Error('empty response');
      typing.remove();
      addMsg(reply, 'bot', false);
      convHistory.push({ role: 'assistant', content: reply });
      addRelated(q);

    } catch(err) {
      typing.remove();
      console.error('Windrose chatbot error:', err.message);

      // Fallback: try FAQ first, otherwise show friendly contact message
      var faqReply = getFaqReply(q);
      if (faqReply) {
        addMsg(faqReply, 'bot', false);
        convHistory.push({ role: 'assistant', content: faqReply });
      } else {
        var fallback = 'For more information, reach out to sales@windrose.ai';
        addMsg(fallback, 'bot', false);
        convHistory.push({ role: 'assistant', content: fallback });
      }
      addRelated(q);
    }
  };

  function renderMarkdown(text) {
    function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function fmt(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>'); }
    var lines = text.split('\n');
    var out = '', inList = false;
    lines.forEach(function(line) {
      var t = line.trim();
      if (t.match(/^[•\-]\s+\S/)) {
        if (!inList) { out += '<ul style="margin:4px 0 4px 0;padding:0 0 0 1.1em;line-height:1.5;list-style:none;">'; inList = true; }
        out += '<li style="margin-bottom:2px;padding-left:0.1em;">' + fmt(t.replace(/^[•\-]\s+/,'')) + '</li>';
      } else {
        if (inList) { out += '</ul>'; inList = false; }
        if (t) out += '<p style="margin:0 0 8px;">' + fmt(t) + '</p>';
      }
    });
    if (inList) out += '</ul>';
    return out;
  }

  function addMsg(text, cls, isHTML) {
    var msgs = document.getElementById('wr-chat-msgs');
    var div = document.createElement('div');
    div.className = 'wr-msg ' + cls;
    if (isHTML) {
      div.innerHTML = text;
    } else if (cls.indexOf('bot') !== -1 && cls.indexOf('typing') === -1) {
      div.innerHTML = renderMarkdown(text);
    } else {
      div.textContent = text;
    }
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  // ── Global UI injection ──────────────────────────────────────────────
  // Injects chat panel + floating button (if not already in page HTML),
  // and adds an "Ask AI" button into whichever fixed header the page has.
  (function injectChatUI() {
    // Shared CSS — only inject once
    if (!document.getElementById('wr-chat-css')) {
      var css = document.createElement('style');
      css.id = 'wr-chat-css';
      css.textContent =
        '#wr-chat-btn{position:fixed!important;bottom:1.5rem!important;right:1.5rem!important;width:auto!important;height:48px!important;z-index:9999!important;background:#0a1f44!important;border:2px solid rgba(0,180,255,.5)!important;border-radius:24px!important;cursor:pointer!important;box-shadow:0 4px 16px rgba(0,120,255,.5)!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:0 20px 0 16px!important;color:#fff!important;font-size:15px!important;font-weight:600!important;letter-spacing:.01em!important;white-space:nowrap!important;transition:background .2s!important;}' +
        '#wr-chat-btn:hover{background:#0d2a5e!important;border-color:rgba(0,180,255,.8)!important;}' +
        '#wr-chat-panel{position:fixed!important;bottom:5.5rem!important;right:1.5rem!important;z-index:9998!important;width:520px!important;max-width:calc(100vw - 2rem)!important;max-height:82vh!important;background:#0a1a30!important;border:1px solid rgba(0,180,255,.3)!important;border-radius:12px!important;box-shadow:0 8px 32px rgba(0,0,0,.5)!important;flex-direction:column!important;overflow:hidden!important;font-family:DM Sans,sans-serif!important;}' +
        '#wr-chat-header{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:.75rem 1rem!important;background:#061525!important;border-bottom:1px solid rgba(0,180,255,.2)!important;font-size:.875rem!important;font-weight:600!important;color:#a0c8ff!important;}' +
        '#wr-chat-close{background:none!important;border:none!important;color:#7a9abf!important;cursor:pointer!important;font-size:1rem!important;padding:0!important;}' +
        '#wr-chat-msgs{flex:1!important;overflow-y:auto!important;padding:1rem!important;background:#0a1a30!important;display:flex!important;flex-direction:column!important;gap:.65rem!important;min-height:200px!important;max-height:65vh!important;}' +
        '#wr-chat-msgs .wr-msg{padding:.65rem .9rem!important;border-radius:10px!important;font-size:.875rem!important;line-height:1.5!important;max-width:85%!important;word-wrap:break-word!important;}' +
        '#wr-chat-msgs .wr-msg.bot{background:rgba(0,120,255,.12)!important;color:#d8e8ff!important;border:1px solid rgba(0,180,255,.15)!important;align-self:flex-start!important;}' +
        '#wr-chat-msgs .wr-msg.user{background:rgba(0,180,255,.25)!important;color:#fff!important;align-self:flex-end!important;}' +
        '#wr-chat-suggestions{display:flex!important;flex-wrap:wrap!important;gap:.4rem!important;padding:.5rem 1rem .75rem!important;background:#0a1a30!important;}' +
        '#wr-chat-suggestions .wr-chip{font-size:.875rem!important;padding:.35rem .7rem!important;background:rgba(0,180,255,.1)!important;border:1px solid rgba(0,180,255,.3)!important;border-radius:4px!important;color:#a0c8ff!important;cursor:pointer!important;transition:all .15s!important;}' +
        '#wr-chat-suggestions .wr-chip:hover{background:rgba(0,180,255,.2)!important;color:#fff!important;}' +
        '#wr-chat-form{display:flex!important;gap:.5rem!important;padding:.75rem 1rem 1rem!important;background:#0a1a30!important;border-top:1px solid rgba(0,180,255,.15)!important;}' +
        '#wr-chat-input{flex:1!important;background:#06122a!important;border:1px solid rgba(0,180,255,.3)!important;border-radius:6px!important;color:#fff!important;font-size:.875rem!important;padding:.55rem .75rem!important;outline:none!important;}' +
        '#wr-chat-input:focus{border-color:rgba(0,180,255,.6)!important;}' +
        '#wr-chat-form button[type=submit]{background:#0078ff!important;border:none!important;border-radius:6px!important;color:#fff!important;padding:0 .85rem!important;cursor:pointer!important;font-size:.875rem!important;}' +
        /* Floating pill hidden — topbar button is the single entry point */
        '#wr-chat-btn{display:none!important;}' +
        '#wr-header-chat{display:none!important;}' +
        /* Topbar Ask AI button style — shown in blue topbar on all pages */
        '#wr-topbar-chat{display:flex!important;align-items:center!important;gap:5px!important;background:rgba(255,255,255,0.12)!important;border:1px solid rgba(255,255,255,0.28)!important;border-radius:4px!important;color:#fff!important;font-family:Barlow Condensed,Arial Narrow,Arial,sans-serif!important;font-size:0.85rem!important;font-weight:700!important;letter-spacing:0.07em!important;padding:3px 12px!important;cursor:pointer!important;white-space:nowrap!important;transition:background .15s,border-color .15s!important;}' +
        '#wr-topbar-chat:hover{background:rgba(255,255,255,0.22)!important;border-color:rgba(255,255,255,0.5)!important;}' +
        /* Language toggle in topbar — left side, all pages */
        '#wr-lang-toggle{flex-shrink:0!important;background:rgba(255,255,255,0.10)!important;border:1px solid rgba(255,255,255,0.28)!important;border-radius:4px!important;color:#fff!important;font-family:Barlow Condensed,Arial Narrow,Arial,sans-serif!important;font-size:0.82rem!important;letter-spacing:0.04em!important;padding:3px 8px!important;cursor:pointer!important;outline:none!important;max-width:175px!important;transition:background .15s,border-color .15s!important;appearance:auto!important;}' +
        '#wr-lang-toggle:hover{background:rgba(255,255,255,0.18)!important;border-color:rgba(255,255,255,0.5)!important;}' +
        '#wr-lang-toggle option{background:#0d1f38!important;color:#f0f4ff!important;}' +
        /* ── Mobile: full-screen chat experience ── */
        '@media(max-width:960px){' +
          /* Lock scroll behind the full-screen panel */
          'body.wr-chat-open{overflow:hidden!important;}' +
          /* Full-screen chat panel */
          '#wr-chat-panel{top:0!important;left:0!important;right:0!important;bottom:0!important;width:100%!important;max-width:100%!important;height:100%!important;max-height:100%!important;border-radius:0!important;border:none!important;z-index:10000!important;}' +
          /* Message area fills all available vertical space */
          '#wr-chat-msgs{flex:1!important;max-height:none!important;padding:1.25rem!important;}' +
          '#wr-chat-msgs .wr-msg{font-size:1rem!important;padding:.8rem 1rem!important;}' +
          /* Bigger header and input */
          '#wr-chat-header{padding:1.1rem 1.25rem!important;font-size:1.05rem!important;}' +
          '#wr-chat-close{font-size:1.4rem!important;line-height:1!important;}' +
          '#wr-chat-input{font-size:1rem!important;padding:.7rem .9rem!important;}' +
          '#wr-chat-form{padding:.75rem 1rem calc(.75rem + env(safe-area-inset-bottom))!important;}' +
        '}';
      document.head.appendChild(css);
    }

    function injectPanelHTML() {
      if (document.getElementById('wr-chat-panel')) return;
      var panel = document.createElement('div');
      panel.id = 'wr-chat-panel';
      panel.style.display = 'none';
      panel.innerHTML =
        '<div id="wr-chat-header"><span>⚡ Windrose Assistant <span style="font-size:.75em;opacity:.55;font-weight:400;letter-spacing:.02em;">· Powered by Claude</span></span><button id="wr-chat-close" onclick="wrChatToggle()">✕</button></div>' +
        '<div id="wr-chat-msgs"><div class="wr-msg bot">Hi! I\'m the Windrose AI assistant. Ask me anything about your E700 — charging, driving, specs, maintenance, or troubleshooting.</div></div>' +
        '<div id="wr-chat-suggestions">' +
          '<span class="wr-chip" onclick="wrAskChip(\'charge\')">Charging?</span>' +
          '<span class="wr-chip" onclick="wrAsk(\'How do I start the vehicle?\')">Start up?</span>' +
          '<span class="wr-chip" onclick="wrAsk(\'How does regenerative braking work?\')">Regen braking?</span>' +
          '<span class="wr-chip" onclick="wrAsk(\'What maintenance is required?\')">Maintenance?</span>' +
        '</div>' +
        '<form id="wr-chat-form" onsubmit="wrSend(event)"><input id="wr-chat-input" type="text" placeholder="Ask a question about your truck…" autocomplete="off"><button type="submit">➤</button></form>';
      document.body.appendChild(panel);
    }

    function injectFloatingBtn() {
      if (document.getElementById('wr-chat-btn')) return;
      var btn = document.createElement('button');
      btn.id = 'wr-chat-btn';
      btn.title = 'Ask the Windrose AI assistant';
      btn.setAttribute('onclick', 'wrChatToggle()');
      btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Ask AI <span style="font-size:.75em;opacity:.6;font-weight:400;">· Powered by Claude</span>';
      document.body.appendChild(btn);
    }

    function injectTopbarBtn() {
      if (document.getElementById('wr-topbar-chat')) return;
      var topbar = document.getElementById('topbar') || document.getElementById('manual-topbar');
      if (!topbar) return;
      var btn = document.createElement('button');
      btn.id = 'wr-topbar-chat';
      btn.title = 'Ask the Windrose AI assistant';
      btn.setAttribute('onclick', 'wrChatToggle()');
      btn.innerHTML = '⚡ Ask AI';
      // Insert before the last child (Reserve / windrose.ai link) so it sits beside it
      var last = topbar.lastElementChild;
      last ? topbar.insertBefore(btn, last) : topbar.appendChild(btn);
    }

    function injectHeaderBtn() {
      if (document.getElementById('wr-header-chat')) return;
      var header = document.querySelector('.site-header');
      if (!header) return;
      var searchDiv = header.querySelector('.header-search');
      var btn = document.createElement('button');
      btn.id = 'wr-header-chat';
      btn.innerHTML = '⚡ Ask AI <span style="font-size:.75em;opacity:.6;font-weight:400;letter-spacing:.02em;">· Powered by Claude</span>';
      btn.setAttribute('onclick', 'wrChatToggle()');
      searchDiv ? header.insertBefore(btn, searchDiv) : header.appendChild(btn);
    }

    function run() {
      injectPanelHTML();
      injectFloatingBtn();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  })();
})();