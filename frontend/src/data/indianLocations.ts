export interface Location {
  value: string;
  label: string;
  districts?: { value: string; label: string; }[];
}

export const indianStates: Location[] = [
  {
    value: 'maharashtra',
    label: 'Maharashtra',
    districts: [
      { value: 'mumbai', label: 'Mumbai' },
      { value: 'pune', label: 'Pune' },
      { value: 'nagpur', label: 'Nagpur' },
      { value: 'thane', label: 'Thane' },
      { value: 'nashik', label: 'Nashik' }
    ]
  },
  {
    value: 'delhi',
    label: 'Delhi',
    districts: [
      { value: 'new-delhi', label: 'New Delhi' },
      { value: 'north-delhi', label: 'North Delhi' },
      { value: 'south-delhi', label: 'South Delhi' },
      { value: 'east-delhi', label: 'East Delhi' },
      { value: 'west-delhi', label: 'West Delhi' }
    ]
  },
  {
    value: 'karnataka',
    label: 'Karnataka',
    districts: [
      { value: 'bangalore', label: 'Bangalore' },
      { value: 'mysore', label: 'Mysore' },
      { value: 'hubli', label: 'Hubli' },
      { value: 'mangalore', label: 'Mangalore' },
      { value: 'belgaum', label: 'Belgaum' }
    ]
  },
  {
    value: 'tamil-nadu',
    label: 'Tamil Nadu',
    districts: [
      { value: 'chennai', label: 'Chennai' },
      { value: 'coimbatore', label: 'Coimbatore' },
      { value: 'madurai', label: 'Madurai' },
      { value: 'salem', label: 'Salem' },
      { value: 'trichy', label: 'Trichy' }
    ]
  },
  {
    value: 'uttar-pradesh',
    label: 'Uttar Pradesh',
    districts: [
      { value: 'lucknow', label: 'Lucknow' },
      { value: 'kanpur', label: 'Kanpur' },
      { value: 'agra', label: 'Agra' },
      { value: 'varanasi', label: 'Varanasi' },
      { value: 'meerut', label: 'Meerut' }
    ]
  },
  {
    value: 'andaman-nicobar',
    label: 'Andaman & Nicobar Islands',
    districts: [
      { value: 'south-andaman', label: 'South Andaman' },
      { value: 'north-middle-andaman', label: 'North & Middle Andaman' },
      { value: 'nicobar', label: 'Nicobar' }
    ]
  },
  {
    value: 'chandigarh',
    label: 'Chandigarh',
    districts: [
      { value: 'chandigarh', label: 'Chandigarh' }
    ]
  },
  {
    value: 'dadra-nagar-haveli',
    label: 'Dadra & Nagar Haveli and Daman & Diu',
    districts: [
      { value: 'dadra-nagar-haveli', label: 'Dadra & Nagar Haveli' },
      { value: 'daman', label: 'Daman' },
      { value: 'diu', label: 'Diu' }
    ]
  },
  {
    value: 'jammu-kashmir',
    label: 'Jammu & Kashmir',
    districts: [
      { value: 'srinagar', label: 'Srinagar' },
      { value: 'jammu', label: 'Jammu' },
      { value: 'anantnag', label: 'Anantnag' },
      { value: 'baramulla', label: 'Baramulla' },
      { value: 'udhampur', label: 'Udhampur' }
    ]
  },
  {
    value: 'ladakh',
    label: 'Ladakh',
    districts: [
      { value: 'leh', label: 'Leh' },
      { value: 'kargil', label: 'Kargil' }
    ]
  },
  {
    value: 'lakshadweep',
    label: 'Lakshadweep',
    districts: [
      { value: 'kavaratti', label: 'Kavaratti' },
      { value: 'agatti', label: 'Agatti' },
      { value: 'amini', label: 'Amini' }
    ]
  },
  {
    value: 'puducherry',
    label: 'Puducherry',
    districts: [
      { value: 'puducherry', label: 'Puducherry' },
      { value: 'karaikal', label: 'Karaikal' },
      { value: 'mahe', label: 'Mahe' },
      { value: 'yanam', label: 'Yanam' }
    ]
  }
]; 