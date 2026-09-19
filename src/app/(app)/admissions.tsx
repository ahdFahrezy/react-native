import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { AppBadge } from '@/components/ui/app-badge';
import { AppCard } from '@/components/ui/app-card';
import { AppDivider } from '@/components/ui/app-divider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { useAdmissions } from '@/hooks/use-admissions';
import { AdmissionTrack, MajorChoice, Applicant } from '@/types/admission.types';
import { Spacing } from '@/constants/theme';

export default function AdmissionsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, login } = useAuth();
  const { submitApplication, submitting } = useAdmissions(false);

  // Multi-step Wizard State (1 to 4)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Personal Info & Track
  const [track, setTrack] = useState<AdmissionTrack>('zonasi');
  const [fullName, setFullName] = useState('Muhammad Bintang Pratama');
  const [nisn, setNisn] = useState('0081234567');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthPlace, setBirthPlace] = useState('Jakarta');
  const [birthDate, setBirthDate] = useState('2009-08-14');
  const [previousSchool, setPreviousSchool] = useState('SMP Negeri 1 Jakarta');
  const [major, setMajor] = useState<MajorChoice>('mipa');

  // Step 2: Parent / Guardian
  const [parentName, setParentName] = useState('Rahmat Hidayat');
  const [relationship, setRelationship] = useState('Father');
  const [parentPhone, setParentPhone] = useState('+62 812-3456-7890');
  const [address, setAddress] = useState('Jl. Menteng Raya No. 45, Jakarta Pusat');
  const [distanceKm, setDistanceKm] = useState('1.4');

  // Step 3: Documents
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [kkUploaded, setKkUploaded] = useState(true);
  const [sklUploaded, setSklUploaded] = useState(true);

  // Step 4: Summary & Confirmation
  const [isAgreed, setIsAgreed] = useState(false);
  const [submittedApplicant, setSubmittedApplicant] = useState<Applicant | null>(null);
  const [draftToast, setDraftToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveDraft = () => {
    setDraftToast(true);
    setTimeout(() => {
      setDraftToast(false);
    }, 2200);
  };

  const handleNextStep = () => {
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!fullName.trim()) {
        setErrorMessage('Please enter the student’s full name.');
        return;
      }
      if (!nisn.trim() || nisn.trim().length !== 10) {
        setErrorMessage('Please provide a valid 10-digit NISN.');
        return;
      }
      if (!previousSchool.trim()) {
        setErrorMessage('Please enter previous junior high school name.');
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!parentName.trim()) {
        setErrorMessage('Please enter parent or guardian full name.');
        return;
      }
      if (!parentPhone.trim()) {
        setErrorMessage('Please enter parent contact phone number.');
        return;
      }
      if (!address.trim()) {
        setErrorMessage('Please enter home residential address.');
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(4);
      return;
    }
  };

  const handleSubmitFinal = async () => {
    if (!isAgreed) {
      setErrorMessage('Please confirm accuracy of the data before submitting.');
      return;
    }

    setErrorMessage(null);
    try {
      const created = await submitApplication({
        name: fullName.trim(),
        nisn: nisn.trim(),
        gender,
        birthPlace: birthPlace.trim(),
        birthDate,
        previousSchool: previousSchool.trim(),
        admissionTrack: track,
        majorChoice: major,
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
        address: address.trim(),
        distanceKm: parseFloat(distanceKm) || 1.5,
        documentCount: (photoUploaded ? 1 : 0) + (kkUploaded ? 1 : 0) + (sklUploaded ? 1 : 0),
        averageScore: 89.2,
      });

      setSubmittedApplicant(created);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setErrorMessage(msg);
    }
  };

  const handleResetForm = () => {
    setSubmittedApplicant(null);
    setCurrentStep(1);
    setIsAgreed(false);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Top App Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <View style={styles.headerLeft}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuQTJg4MBYOPkskHegfvZ2Yo2goOt4RQsx4MWQwYVSKTwXWvWBRc2eNh-h4XQlL89h_0aBibw0zvJRrnOppz3ISzFeeWC-yxWjhWLBfxgedpR0Udz6rFm6J0duTTI0tg9IrErXeRxaklJIfVK7l2qX8yyMRSkAj2Oe5Jf1Bm2Ofppqa4lXvOnzxIXNhjIOKxxKY-oY1OIA2exAh6xpg1LWxU9FodVGS_jj9l07u48svTb3PC5uJ9z1',
              }}
              style={styles.crestLogo}
              resizeMode="contain"
            />
            <View style={styles.headerTitleCol}>
              <ThemedText style={styles.headerSubtitle}>
                PPDB ONLINE • STUDENT ADMISSION PORTAL
              </ThemedText>
              <ThemedText style={styles.headerMainTitle}>
                SMA Bintang Bangsa
              </ThemedText>
            </View>
          </View>

          <View style={styles.headerRight}>
            <ThemeToggle />
            <Pressable
              onPress={async () => {
                await login({ email: 'admin@example.com', password: 'password123' });
                router.replace('/home');
              }}
              style={({ pressed }) => [
                styles.roleSwitchBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <ThemedText style={styles.roleSwitchBtnText}>
                👑 Switch to Admin
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero Banner: PPDB 2025/2026 */}
          <View style={styles.banner}>
            <View style={styles.bannerTopRow}>
              <View style={styles.sessionBadge}>
                <View style={styles.pulsingDot} />
                <ThemedText style={styles.sessionBadgeText}>PPDB 2025/2026 • Wave 1</ThemedText>
              </View>
              <View style={styles.deadlineBadge}>
                <ThemedText style={styles.deadlineBadgeText}>⏱ 8 Days Remaining</ThemedText>
              </View>
            </View>

            <ThemedText style={styles.bannerTitle}>
              New Student Admissions Wave 1
            </ThemedText>
            <ThemedText style={styles.bannerDesc}>
              Welcome prospective scholars. Please complete the official admissions registration form with authentic and verified information.
            </ThemedText>

            <View style={styles.bannerStatsGrid}>
              <View style={styles.bannerStatCol}>
                <ThemedText style={styles.statLabel}>Remaining Quota</ThemedText>
                <ThemedText style={styles.statValue}>
                  64 <ThemedText style={styles.statValueSub}>/ 180 Seats</ThemedText>
                </ThemedText>
              </View>
              <View style={styles.bannerStatDivider} />
              <View style={styles.bannerStatCol}>
                <ThemedText style={styles.statLabel}>Registration Deadline</ThemedText>
                <ThemedText style={styles.statValue}>June 30, 2025</ThemedText>
              </View>
            </View>
          </View>

          {/* Success State View after Submission */}
          {submittedApplicant ? (
            <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <View style={styles.successIconCircle}>
                <ThemedText style={{ fontSize: 40 }}>🎉</ThemedText>
              </View>
              <ThemedText style={styles.successHeading}>Application Submitted!</ThemedText>
              <ThemedText style={styles.successSubheading}>
                Congratulations, {submittedApplicant.name}! Your admission application has been registered into the queue.
              </ThemedText>

              <View style={[styles.successDetailsBox, { backgroundColor: theme.background }]}>
                <View style={styles.successRow}>
                  <ThemedText style={styles.successRowLabel}>Application ID:</ThemedText>
                  <ThemedText style={styles.successRowValue}>{submittedApplicant.id}</ThemedText>
                </View>
                <View style={styles.successRow}>
                  <ThemedText style={styles.successRowLabel}>NISN:</ThemedText>
                  <ThemedText style={styles.successRowValue}>{submittedApplicant.nisn}</ThemedText>
                </View>
                <View style={styles.successRow}>
                  <ThemedText style={styles.successRowLabel}>Admission Track:</ThemedText>
                  <ThemedText style={styles.successRowValue}>{submittedApplicant.admissionTrack}</ThemedText>
                </View>
                <View style={styles.successRow}>
                  <ThemedText style={styles.successRowLabel}>Major Program:</ThemedText>
                  <ThemedText style={styles.successRowValue}>{submittedApplicant.majorChoice}</ThemedText>
                </View>
                <View style={styles.successRow}>
                  <ThemedText style={styles.successRowLabel}>Current Status:</ThemedText>
                  <AppBadge label="Pending Verification" variant="warning" size="sm" dot />
                </View>
              </View>

              <View style={styles.successActions}>
                <AppButton
                  title="View in Admin Verification Stack"
                  variant="primary"
                  size="lg"
                  onPress={() => router.push('/home')}
                />
                <AppButton
                  title="Register Another Student"
                  variant="outline"
                  size="md"
                  onPress={handleResetForm}
                />
              </View>
            </View>
          ) : (
            <>
              {/* 4-Step Progress Indicator */}
              <View style={[styles.stepCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <View style={styles.stepHeaderRow}>
                  <ThemedText style={styles.stepCountText}>Step {currentStep} of 4</ThemedText>
                  <ThemedText style={styles.stepPercentText}>{currentStep * 25}% Completed</ThemedText>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${currentStep * 25}%` }]} />
                </View>

                <View style={styles.stepPillRow}>
                  {[
                    { step: 1, label: 'Personal' },
                    { step: 2, label: 'Parents' },
                    { step: 3, label: 'Documents' },
                    { step: 4, label: 'Review' },
                  ].map((item) => (
                    <Pressable
                      key={item.step}
                      onPress={() => {
                        if (item.step < currentStep) setCurrentStep(item.step as 1 | 2 | 3 | 4);
                      }}
                      style={styles.stepPillItem}
                    >
                      <View
                        style={[
                          styles.stepPillCircle,
                          currentStep === item.step
                            ? styles.stepCircleActive
                            : currentStep > item.step
                            ? styles.stepCircleCompleted
                            : styles.stepCircleInactive,
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.stepCircleText,
                            currentStep >= item.step ? styles.stepCircleTextActive : {},
                          ]}
                        >
                          {currentStep > item.step ? '✓' : item.step}
                        </ThemedText>
                      </View>
                      <ThemedText
                        style={[
                          styles.stepPillLabel,
                          currentStep === item.step && styles.stepPillLabelActive,
                        ]}
                      >
                        {item.label}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Error Notice */}
              {errorMessage && (
                <View style={styles.errorBox}>
                  <ThemedText style={styles.errorText}>⚠️ {errorMessage}</ThemedText>
                </View>
              )}

              {/* Step 1: Personal Information & Track */}
              {currentStep === 1 && (
                <View style={styles.formSection}>
                  {/* Track Selection */}
                  <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                    <ThemedText style={styles.cardSectionTitle}>📍 Admission Track</ThemedText>
                    <ThemedText style={styles.cardSectionDesc}>
                      Select the qualification track that corresponds to your admission criteria.
                    </ThemedText>

                    <View style={styles.trackList}>
                      {/* Zonasi */}
                      <Pressable
                        onPress={() => setTrack('zonasi')}
                        style={[
                          styles.trackOption,
                          track === 'zonasi' && styles.trackOptionActive,
                          { borderColor: track === 'zonasi' ? '#0D9488' : theme.border },
                        ]}
                      >
                        <View style={styles.trackRadio}>
                          {track === 'zonasi' && <View style={styles.trackRadioDot} />}
                        </View>
                        <View style={styles.trackContent}>
                          <View style={styles.trackHeaderRow}>
                            <ThemedText style={styles.trackTitle}>Zoning Track (Zonasi)</ThemedText>
                            <AppBadge label="50% Quota" variant="primary" size="sm" />
                          </View>
                          <ThemedText style={styles.trackDesc}>
                            Prioritizes proximity of residential family card address to the school.
                          </ThemedText>
                        </View>
                      </Pressable>

                      {/* Prestasi */}
                      <Pressable
                        onPress={() => setTrack('prestasi')}
                        style={[
                          styles.trackOption,
                          track === 'prestasi' && styles.trackOptionActive,
                          { borderColor: track === 'prestasi' ? '#0D9488' : theme.border },
                        ]}
                      >
                        <View style={styles.trackRadio}>
                          {track === 'prestasi' && <View style={styles.trackRadioDot} />}
                        </View>
                        <View style={styles.trackContent}>
                          <View style={styles.trackHeaderRow}>
                            <ThemedText style={styles.trackTitle}>Academic Achievement (Prestasi)</ThemedText>
                            <AppBadge label="30% Quota" variant="info" size="sm" />
                          </View>
                          <ThemedText style={styles.trackDesc}>
                            Evaluated based on report card grades and certified competition awards.
                          </ThemedText>
                        </View>
                      </Pressable>

                      {/* Afirmasi */}
                      <Pressable
                        onPress={() => setTrack('afirmasi')}
                        style={[
                          styles.trackOption,
                          track === 'afirmasi' && styles.trackOptionActive,
                          { borderColor: track === 'afirmasi' ? '#0D9488' : theme.border },
                        ]}
                      >
                        <View style={styles.trackRadio}>
                          {track === 'afirmasi' && <View style={styles.trackRadioDot} />}
                        </View>
                        <View style={styles.trackContent}>
                          <View style={styles.trackHeaderRow}>
                            <ThemedText style={styles.trackTitle}>Affirmation Track (Afirmasi)</ThemedText>
                            <AppBadge label="20% Quota" variant="warning" size="sm" />
                          </View>
                          <ThemedText style={styles.trackDesc}>
                            Dedicated for holders of official scholarship / government aid cards (KIP / KKS).
                          </ThemedText>
                        </View>
                      </Pressable>
                    </View>
                  </View>

                  {/* Student Biodata */}
                  <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                    <ThemedText style={styles.cardSectionTitle}>👤 Student Biodata</ThemedText>
                    <ThemedText style={styles.cardSectionDesc}>
                      Information must strictly match your formal Birth Certificate and Junior High Diploma.
                    </ThemedText>

                    <AppInput
                      label="Student Full Name"
                      placeholder="e.g. Muhammad Bintang Pratama"
                      value={fullName}
                      onChangeText={setFullName}
                    />

                    <AppInput
                      label="NISN (10-Digit National Student ID)"
                      placeholder="e.g. 0081234567"
                      keyboardType="numeric"
                      maxLength={10}
                      value={nisn}
                      onChangeText={setNisn}
                    />

                    {/* Gender Selection */}
                    <View style={styles.fieldGroup}>
                      <ThemedText style={styles.inputLabel}>Gender</ThemedText>
                      <View style={styles.genderRow}>
                        <Pressable
                          onPress={() => setGender('M')}
                          style={[
                            styles.genderButton,
                            gender === 'M' && styles.genderButtonActive,
                            { borderColor: gender === 'M' ? '#0D9488' : theme.border },
                          ]}
                        >
                          <ThemedText style={{ fontSize: 16 }}>👦</ThemedText>
                          <ThemedText
                            style={[
                              styles.genderText,
                              gender === 'M' && styles.genderTextActive,
                            ]}
                          >
                            Male (Laki-laki)
                          </ThemedText>
                        </Pressable>

                        <Pressable
                          onPress={() => setGender('F')}
                          style={[
                            styles.genderButton,
                            gender === 'F' && styles.genderButtonActive,
                            { borderColor: gender === 'F' ? '#0D9488' : theme.border },
                          ]}
                        >
                          <ThemedText style={{ fontSize: 16 }}>👧</ThemedText>
                          <ThemedText
                            style={[
                              styles.genderText,
                              gender === 'F' && styles.genderTextActive,
                            ]}
                          >
                            Female (Perempuan)
                          </ThemedText>
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.rowInputs}>
                      <View style={{ flex: 1 }}>
                        <AppInput
                          label="Place of Birth"
                          placeholder="City / District"
                          value={birthPlace}
                          onChangeText={setBirthPlace}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <AppInput
                          label="Date of Birth"
                          placeholder="YYYY-MM-DD"
                          value={birthDate}
                          onChangeText={setBirthDate}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Previous Education & Major Preference */}
                  <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                    <ThemedText style={styles.cardSectionTitle}>🏫 Previous Education & Major Choice</ThemedText>
                    <ThemedText style={styles.cardSectionDesc}>
                      Select your intended academic pathway at Bintang Bangsa High School.
                    </ThemedText>

                    <AppInput
                      label="Junior High School (SMP / MTs)"
                      placeholder="e.g. SMP Negeri 1 Jakarta"
                      value={previousSchool}
                      onChangeText={setPreviousSchool}
                    />

                    <View style={styles.fieldGroup}>
                      <ThemedText style={styles.inputLabel}>Specialization Stream</ThemedText>
                      <View style={styles.majorList}>
                        {[
                          {
                            id: 'mipa',
                            icon: '🔬',
                            name: 'MIPA (Natural Sciences & Math)',
                            desc: 'Physics, Chemistry, Biology, Advanced Calculus',
                          },
                          {
                            id: 'ips',
                            icon: '🌐',
                            name: 'IPS (Social Studies & Economics)',
                            desc: 'Sociology, Economics, Geography, Global Affairs',
                          },
                          {
                            id: 'bahasa',
                            icon: '🗣',
                            name: 'Languages & Cultural Studies',
                            desc: 'Linguistics, English, Mandarin & Global Literature',
                          },
                        ].map((item) => (
                          <Pressable
                            key={item.id}
                            onPress={() => setMajor(item.id as MajorChoice)}
                            style={[
                              styles.majorOption,
                              major === item.id && styles.majorOptionActive,
                              { borderColor: major === item.id ? '#0D9488' : theme.border },
                            ]}
                          >
                            <ThemedText style={{ fontSize: 24 }}>{item.icon}</ThemedText>
                            <View style={{ flex: 1 }}>
                              <ThemedText style={styles.majorTitle}>{item.name}</ThemedText>
                              <ThemedText style={styles.majorDesc}>{item.desc}</ThemedText>
                            </View>
                            <View style={styles.trackRadio}>
                              {major === item.id && <View style={styles.trackRadioDot} />}
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Step 2: Parent / Guardian Info */}
              {currentStep === 2 && (
                <View style={styles.formSection}>
                  <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                    <ThemedText style={styles.cardSectionTitle}>👨‍👩‍👧 Parents & Guardians</ThemedText>
                    <ThemedText style={styles.cardSectionDesc}>
                      Emergency contact and correspondence for school communications.
                    </ThemedText>

                    <AppInput
                      label="Parent or Guardian Full Name"
                      placeholder="e.g. Rahmat Hidayat"
                      value={parentName}
                      onChangeText={setParentName}
                    />

                    <AppInput
                      label="Relationship to Applicant"
                      placeholder="Father / Mother / Legal Guardian"
                      value={relationship}
                      onChangeText={setRelationship}
                    />

                    <AppInput
                      label="WhatsApp / Contact Phone Number"
                      placeholder="+62 812-3456-7890"
                      keyboardType="phone-pad"
                      value={parentPhone}
                      onChangeText={setParentPhone}
                    />

                    <AppInput
                      label="Residential Family Address"
                      placeholder="Full street address according to Family Card (KK)"
                      multiline
                      numberOfLines={3}
                      value={address}
                      onChangeText={setAddress}
                    />

                    <AppInput
                      label="Estimated Distance to School (Km)"
                      placeholder="e.g. 1.4"
                      keyboardType="numeric"
                      value={distanceKm}
                      onChangeText={setDistanceKm}
                    />
                  </View>
                </View>
              )}

              {/* Step 3: Document Uploads */}
              {currentStep === 3 && (
                <View style={styles.formSection}>
                  <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                    <ThemedText style={styles.cardSectionTitle}>📁 Document Uploads</ThemedText>
                    <ThemedText style={styles.cardSectionDesc}>
                      Upload high-resolution scans or photos in PDF, JPG, or PNG format (max 2MB each).
                    </ThemedText>

                    {/* Photo Upload Card */}
                    <View style={[styles.docCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      <View style={styles.docHeaderRow}>
                        <ThemedText style={styles.docTitle}>📸 Formal Student Photograph (3x4)</ThemedText>
                        <AppBadge label="Mandatory" variant="primary" size="sm" />
                      </View>
                      <ThemedText style={styles.docDesc}>
                        Red or blue studio background with junior high school uniform.
                      </ThemedText>

                      <View style={styles.docPreviewRow}>
                        <Image
                          source={{
                            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRXFBxUjCpGdRbBtDglrUI9r0UObWZSKwToACymGmYCvcXOI5jJmOY1K9jnXrPMnGyN7wRgSxzlV2wWKNUnA5YXNh2aBj5dHELN0nXjiAJmMnDW9ozGQoLHG0BJh_XdSHFEMToNfXdjT61N3TpAj1uIXV0XV3WIlL67H51vIBWot9QxN9TZBbQQITht79m_kuWxNu3VgKan7I9uCA0Utl7-T_4ZZtO_-0GzoGMmFAFBW7Dx82Ixeb0',
                          }}
                          style={styles.docThumb}
                        />
                        <View style={{ flex: 1 }}>
                          <ThemedText style={styles.docFileName}>formal_photo_aditya_2025.jpg</ThemedText>
                          <ThemedText style={styles.docFileSize}>840 KB • Ready to submit</ThemedText>
                        </View>
                        <AppBadge label="Uploaded" variant="success" size="sm" />
                      </View>
                    </View>

                    {/* Family Card (KK) */}
                    <View style={[styles.docCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      <View style={styles.docHeaderRow}>
                        <ThemedText style={styles.docTitle}>📄 Family Card (Kartu Keluarga)</ThemedText>
                        <AppBadge label="Mandatory" variant="primary" size="sm" />
                      </View>
                      <ThemedText style={styles.docDesc}>
                        Clear photocopy / scan showing full family members and barcode stamp.
                      </ThemedText>
                      <Pressable
                        onPress={() => setKkUploaded(!kkUploaded)}
                        style={[styles.uploadBox, { borderColor: theme.border }]}
                      >
                        <ThemedText style={{ fontSize: 24 }}>📑</ThemedText>
                        <ThemedText style={styles.uploadBoxTitle}>
                          {kkUploaded ? 'kartu_keluarga_aditya_menteng.pdf' : 'Tap to select KK Document'}
                        </ThemedText>
                        <ThemedText style={styles.uploadBoxSub}>
                          {kkUploaded ? '1.2 MB • Verified' : 'Max file size 2MB'}
                        </ThemedText>
                      </Pressable>
                    </View>

                    {/* Graduation Certificate */}
                    <View style={[styles.docCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      <View style={styles.docHeaderRow}>
                        <ThemedText style={styles.docTitle}>📜 Graduation Certificate / SKL</ThemedText>
                        <AppBadge label="Optional" variant="neutral" size="sm" />
                      </View>
                      <ThemedText style={styles.docDesc}>
                        Legalized certificate from previous junior high school.
                      </ThemedText>
                      <Pressable
                        onPress={() => setSklUploaded(!sklUploaded)}
                        style={[styles.uploadBox, { borderColor: theme.border }]}
                      >
                        <ThemedText style={{ fontSize: 24 }}>🎓</ThemedText>
                        <ThemedText style={styles.uploadBoxTitle}>
                          {sklUploaded ? 'skl_smpn1_jakarta_aditya.pdf' : 'Tap to upload certificate'}
                        </ThemedText>
                        <ThemedText style={styles.uploadBoxSub}>
                          {sklUploaded ? '950 KB • Attached' : 'PDF or clear photo'}
                        </ThemedText>
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}

              {/* Step 4: Summary & Payment */}
              {currentStep === 4 && (
                <View style={styles.formSection}>
                  {/* Fee Breakdown Card */}
                  <View style={[styles.feeCard, { backgroundColor: '#0F172A', borderColor: '#1E293B' }]}>
                    <View style={styles.feeHeader}>
                      <ThemedText style={{ fontSize: 20 }}>💳</ThemedText>
                      <ThemedText style={styles.feeHeaderTitle}>Registration Fee Breakdown</ThemedText>
                    </View>

                    <View style={styles.feeRow}>
                      <ThemedText style={styles.feeLabel}>PPDB Online Application Fee</ThemedText>
                      <ThemedText style={styles.feeAmount}>Rp 150,000</ThemedText>
                    </View>

                    <View style={styles.feeRow}>
                      <ThemedText style={styles.feeLabel}>Aptitude & Talent Mapping Test</ThemedText>
                      <ThemedText style={styles.feeAmount}>Rp 100,000</ThemedText>
                    </View>

                    <View style={styles.feeDivider} />

                    <View style={styles.feeTotalRow}>
                      <ThemedText style={styles.feeTotalLabel}>Total Verification Fee</ThemedText>
                      <ThemedText style={styles.feeTotalAmount}>Rp 250,000</ThemedText>
                    </View>

                    <View style={styles.feeNotice}>
                      <ThemedText style={styles.feeNoticeText}>
                        ℹ️ Payment instructions with Virtual Account will be generated once application is verified.
                      </ThemedText>
                    </View>
                  </View>

                  {/* Summary Review Card */}
                  <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                    <ThemedText style={styles.cardSectionTitle}>📝 Application Summary</ThemedText>
                    <ThemedText style={styles.cardSectionDesc}>
                      Review the details below prior to submitting your official application.
                    </ThemedText>

                    <View style={styles.summaryItem}>
                      <ThemedText style={styles.summaryLabel}>Applicant Name:</ThemedText>
                      <ThemedText style={styles.summaryValue}>{fullName}</ThemedText>
                    </View>
                    <View style={styles.summaryItem}>
                      <ThemedText style={styles.summaryLabel}>NISN:</ThemedText>
                      <ThemedText style={styles.summaryValue}>{nisn}</ThemedText>
                    </View>
                    <View style={styles.summaryItem}>
                      <ThemedText style={styles.summaryLabel}>Track & Major:</ThemedText>
                      <ThemedText style={styles.summaryValue}>
                        {track.toUpperCase()} • {major.toUpperCase()}
                      </ThemedText>
                    </View>
                    <View style={styles.summaryItem}>
                      <ThemedText style={styles.summaryLabel}>Junior High School:</ThemedText>
                      <ThemedText style={styles.summaryValue}>{previousSchool}</ThemedText>
                    </View>
                    <View style={styles.summaryItem}>
                      <ThemedText style={styles.summaryLabel}>Parent / Guardian:</ThemedText>
                      <ThemedText style={styles.summaryValue}>{parentName} ({parentPhone})</ThemedText>
                    </View>

                    {/* Declaration Checkbox */}
                    <Pressable
                      onPress={() => setIsAgreed(!isAgreed)}
                      style={styles.checkboxRow}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isAgreed && styles.checkboxActive,
                          { borderColor: isAgreed ? '#0D9488' : theme.textSecondary },
                        ]}
                      >
                        {isAgreed && <ThemedText style={styles.checkmark}>✓</ThemedText>}
                      </View>
                      <ThemedText style={styles.checkboxLabel}>
                        I hereby declare that all information submitted in this application is genuine, accurate, and valid.
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Draft Notification Toast */}
              {draftToast && (
                <View style={styles.toast}>
                  <ThemedText style={styles.toastText}>✅ Draft successfully saved to local device!</ThemedText>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Sticky Bottom Action Bar */}
        {!submittedApplicant && (
          <View style={[styles.bottomBar, { backgroundColor: theme.backgroundElement, borderTopColor: theme.border }]}>
            <View style={styles.bottomBarInner}>
              <Pressable onPress={handleSaveDraft} style={styles.draftButton}>
                <ThemedText style={styles.draftButtonText}>💾 Save Draft</ThemedText>
              </Pressable>

              {currentStep > 1 && (
                <Pressable
                  onPress={() => setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4)}
                  style={styles.backButton}
                >
                  <ThemedText style={styles.backButtonText}>Previous</ThemedText>
                </Pressable>
              )}

              {currentStep < 4 ? (
                <AppButton
                  title="Continue ➔"
                  variant="primary"
                  size="md"
                  onPress={handleNextStep}
                />
              ) : (
                <AppButton
                  title="Submit Application"
                  variant="primary"
                  size="md"
                  loading={submitting}
                  onPress={handleSubmitFinal}
                />
              )}
            </View>
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  crestLogo: {
    width: 36,
    height: 36,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
    letterSpacing: 0.8,
  },
  headerMainTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  roleSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#0D9488',
  },
  roleSwitchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2DD4BF',
  },
  roleBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: 120,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  banner: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: Spacing.four,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(13, 148, 136, 0.25)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0D9488',
  },
  sessionBadgeText: {
    color: '#2DD4BF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deadlineBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deadlineBadgeText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: '#94A3B8',
  },
  bannerStatsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: Spacing.three,
    marginTop: Spacing.one,
  },
  bannerStatCol: {
    flex: 1,
    gap: 2,
  },
  bannerStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: Spacing.two,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statValueSub: {
    fontSize: 12,
    fontWeight: '400',
    color: '#94A3B8',
  },
  stepCard: {
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    gap: Spacing.two,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepCountText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.8,
  },
  stepPercentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(120, 120, 120, 0.15)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0D9488',
    borderRadius: 3,
  },
  stepPillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
  },
  stepPillItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  stepPillCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#0D9488',
  },
  stepCircleCompleted: {
    backgroundColor: '#0F766E',
  },
  stepCircleInactive: {
    backgroundColor: 'rgba(120, 120, 120, 0.15)',
  },
  stepCircleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888888',
  },
  stepCircleTextActive: {
    color: '#FFFFFF',
  },
  stepPillLabel: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.6,
  },
  stepPillLabelActive: {
    fontWeight: '700',
    color: '#0D9488',
    opacity: 1,
  },
  formSection: {
    gap: Spacing.four,
  },
  card: {
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    gap: Spacing.three,
  },
  cardSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardSectionDesc: {
    fontSize: 13,
    opacity: 0.65,
    lineHeight: 18,
  },
  trackList: {
    gap: Spacing.two,
  },
  trackOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  trackOptionActive: {
    backgroundColor: 'rgba(13, 148, 136, 0.08)',
  },
  trackRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  trackRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D9488',
  },
  trackContent: {
    flex: 1,
    gap: 2,
  },
  trackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  trackDesc: {
    fontSize: 12,
    opacity: 0.65,
    lineHeight: 16,
  },
  fieldGroup: {
    gap: Spacing.one,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  genderRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  genderButtonActive: {
    backgroundColor: 'rgba(13, 148, 136, 0.12)',
  },
  genderText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
  genderTextActive: {
    color: '#0D9488',
    opacity: 1,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  majorList: {
    gap: Spacing.two,
  },
  majorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  majorOptionActive: {
    backgroundColor: 'rgba(13, 148, 136, 0.08)',
  },
  majorTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  majorDesc: {
    fontSize: 11,
    opacity: 0.65,
  },
  docCard: {
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.two,
  },
  docHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  docDesc: {
    fontSize: 11,
    opacity: 0.6,
  },
  docPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'rgba(120, 120, 120, 0.08)',
    padding: Spacing.two,
    borderRadius: 8,
  },
  docThumb: {
    width: 40,
    height: 52,
    borderRadius: 4,
  },
  docFileName: {
    fontSize: 12,
    fontWeight: '600',
  },
  docFileSize: {
    fontSize: 10,
    opacity: 0.5,
  },
  uploadBox: {
    padding: Spacing.three,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 4,
  },
  uploadBoxTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  uploadBoxSub: {
    fontSize: 10,
    opacity: 0.5,
  },
  feeCard: {
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: 1,
    gap: Spacing.two,
  },
  feeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  feeHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feeLabel: {
    fontSize: 13,
    color: '#94A3B8',
  },
  feeAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  feeDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: Spacing.one,
  },
  feeTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  feeTotalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2DD4BF',
  },
  feeNotice: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: Spacing.two,
    borderRadius: 8,
    marginTop: Spacing.one,
  },
  feeNoticeText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(120, 120, 120, 0.15)',
  },
  summaryLabel: {
    fontSize: 13,
    opacity: 0.65,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#0D9488',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  checkboxLabel: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
    opacity: 0.8,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    padding: Spacing.two,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  toast: {
    backgroundColor: '#0D9488',
    padding: Spacing.two,
    borderRadius: 10,
    alignItems: 'center',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  bottomBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.two,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  draftButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 8,
    backgroundColor: 'rgba(120, 120, 120, 0.1)',
    marginRight: 'auto',
  },
  draftButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
  successIconCircle: {
    alignItems: 'center',
    marginVertical: Spacing.two,
  },
  successHeading: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  successSubheading: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 18,
  },
  successDetailsBox: {
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.two,
    marginVertical: Spacing.two,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successRowLabel: {
    fontSize: 12,
    opacity: 0.65,
  },
  successRowValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  successActions: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
});
