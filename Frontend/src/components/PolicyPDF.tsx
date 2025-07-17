import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontSize: 10, 
     ontFamily: 'Helvetica',
    lineHeight: 1.4,
    color: '#1f2937'
  },
  

  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    borderBottomStyle: 'solid'
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',

     color: '#1e40af',
    textAlign: 'center',
    marginBottom: 10
  },
  
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center'
  },
  
  
  section: { 
    marginBottom: 20,
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 4,

    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    borderLeftStyle: 'solid'
  },
  
  sectionHeading: { 
    fontSize: 16, 
    marginBottom: 12, 
    fontWeight: 'bold',
    color: '#1e40af',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  
  subsectionHeading: { 
    fontSize: 13, 
    marginBottom: 8, 
    fontWeight: 'bold', 
    color: '#374151',
    backgroundColor: '#e5e7eb',
    padding: 6,
    borderRadius: 3

  },

  infoRow: { 
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start'
  },
  
  label: { 
    fontWeight: 'bold', 
    color: '#4b5563',
    width: 120,
    fontSize: 10
  },
  
  value: {
    color: '#1f2937',
    flex: 1,
    fontSize: 10
  },
  

  itemGroup: { 
    marginBottom: 15, 
    paddingBottom: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#d1d5db', 

    borderBottomStyle: 'solid'
  },
  
  itemGroupLast: {
    marginBottom: 15,
    paddingBottom: 0,
    borderBottomWidth: 0
  },
  

  coverageContainer: {
    marginTop: 8,
    marginLeft: 10,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'solid'

  },
  
  coverageTitle: {
    fontSize: 10,
    fontWeight: 'bold',

    color: '#374151',
    marginBottom: 4
  },
  
  coverageItem: {
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 3,
    paddingLeft: 8
  },
  

  addressText: {
    fontSize: 10,
    color: '#1f2937',
    lineHeight: 1.3
  },
  

  statusActive: {
    color: '#059669',
    fontWeight: 'bold'
  },
  
  statusInactive: {
    color: '#dc2626',
    fontWeight: 'bold'
  },
  
 
  spacer: {
    height: 10
  },
  
  highlight: {
    backgroundColor: '#fef3c7',
    padding: 2,
    borderRadius: 2
  }
});

const PolicyPDF = ({ data }: { data: any }) => {
  const formatCurrency = (amount: string | number) => {
    return `R${amount?.toLocaleString() || amount}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusStyle = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    return lowerStatus === 'active' || lowerStatus === 'valid' ? 
      styles.statusActive : styles.statusInactive;
  };

  return (
    <Document>
      <Page style={styles.page}>
 
        <View style={styles.header}>
          <Text style={styles.title}>Insurance Policy Document</Text>
          <Text style={styles.subtitle}>Policy Number: {data.policyNo}</Text>
        </View>

      
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Policy Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Policy Number:</Text>
            <Text style={[styles.value, styles.highlight]}>{data.policyNo}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, getStatusStyle(data.policyStatus)]}>{data.policyStatus}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Policy Type:</Text>
            <Text style={styles.value}>{data.policyType}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Effective Date:</Text>
            <Text style={styles.value}>{formatDate(data.policyEffectiveDate)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Expiration Date:</Text>
            <Text style={styles.value}>{formatDate(data.policyExpirationDate)}</Text>
          </View>
        </View>

     
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Policy Holder</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{data.policyHolder.firstName} {data.policyHolder.lastName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={[styles.value, styles.addressText]}>
              {data.policyHolder.address.street}{'\n'}
              {data.policyHolder.address.city}, {data.policyHolder.address.state} {data.policyHolder.address.zip}
            </Text>
          </View>
        </View>

      
        {data.drivers?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Authorized Drivers</Text>
            {data.drivers.map((driver: any, idx: number) => (
              <View key={idx} style={idx === data.drivers.length - 1 ? styles.itemGroupLast : styles.itemGroup}>
                <Text style={styles.subsectionHeading}>
                  {driver.firstName} {driver.lastName}
                </Text>
                
                <View style={styles.infoRow}>
                
                  <Text style={styles.label}>Age:</Text>
                  <Text style={styles.value}>{driver.age} years</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Gender:</Text>
                  <Text style={styles.value}>{driver.gender}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Marital Status:</Text>
                 
                  <Text style={styles.value}>{driver.maritalStatus}</Text>
                </View>
                
                <View style={styles.infoRow}>
                
                  <Text style={styles.label}>License Number:</Text>
                  <Text style={styles.value}>{driver.licenseNumber}</Text>
                </View>
                
                <View style={styles.infoRow}>
                
                  <Text style={styles.label}>License State:</Text>
                  <Text style={styles.value}>{driver.licenseState}</Text>
                </View>
                
                <View style={styles.infoRow}>
                
                  <Text style={styles.label}>License Status:</Text>
                  <Text style={[styles.value, getStatusStyle(driver.licenseStatus)]}>{driver.licenseStatus}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.label}>License Period:</Text>
                  <Text style={styles.value}>
                    {formatDate(driver.licenseEffectiveDate)} - {formatDate(driver.licenseExpirationDate)}
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.label}>License Class:</Text>
                  <Text style={styles.value}>{driver.licenseClass}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

    
        {data.vehicles?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Insured Vehicles</Text>
            {data.vehicles.map((vehicle: any, idx: number) => (
              <View key={idx} style={idx === data.vehicles.length - 1 ? styles.itemGroupLast : styles.itemGroup}>
                <Text style={styles.subsectionHeading}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </Text>
                
                <View style={styles.infoRow}>
                  <Text style={styles.label}>VIN:</Text>
                  <Text style={styles.value}>{vehicle.vin}</Text>
                </View>
                
                <View style={styles.infoRow}>
                 
                  <Text style={styles.label}>Usage:</Text>
                  <Text style={styles.value}>{vehicle.usage}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Primary Use:</Text>
                
                  <Text style={styles.value}>{vehicle.primaryUse}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Annual Mileage:</Text>
                 
                  <Text style={styles.value}>{vehicle.annualMileage?.toLocaleString()} km</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Ownership:</Text>
                  
                  <Text style={styles.value}>{vehicle.ownership}</Text>
                </View>
                
                <View style={styles.infoRow}>
                 
                  <Text style={styles.label}>Garaging Address:</Text>
                  <Text style={[styles.value, styles.addressText]}>
                  
                    {vehicle.garagingAddress.street}{'\n'}
                    {vehicle.garagingAddress.city}, {vehicle.garagingAddress.state} {vehicle.garagingAddress.zip}
                  </Text>
                </View>
                
                {vehicle.coverages?.length > 0 && (
                  <View style={styles.coverageContainer}>
                    <Text style={styles.coverageTitle}>Coverage Details</Text>
                    {vehicle.coverages.map((coverage: any, coverageIdx: number) => (
                  
                  <Text key={coverageIdx} style={styles.coverageItem}>
                        • {coverage.type}: Limit {formatCurrency(coverage.limit)}, Deductible {formatCurrency(coverage.deductible)}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PolicyPDF; 