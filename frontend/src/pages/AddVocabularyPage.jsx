import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  InputAdornment,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ArrowBack, CloudUpload, Delete, LocalFireDepartment, LocalFireDepartmentOutlined } from '@mui/icons-material';
import { AiAssistButton } from '../components/AiAssistButton';
import { createVocabulary } from '../services/vocabularyService';
import { getSlots } from '../services/slotsService';

export default function AddVocabularyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageError, setImageError] = useState('');
  const [form, setForm] = useState({
    word: '',
    meaning: '',
    partOfSpeech: '',
    example: '',
    image: null,
    imagePreview: null,
    tags: [],
    tagInput: '',
    pronunciation: '',
    pastTense: '',
    futureTense: '',
  });

  const PART_OF_SPEECH_OPTIONS = [
    { value: 'noun', label: 'Noun', description: 'Person, thing, or idea' },
    { value: 'pronoun', label: 'Pronoun', description: 'Replaces a noun' },
    { value: 'verb', label: 'Verb', description: 'Action or state' },
    { value: 'adjective', label: 'Adjective', description: 'Describes a noun' },
    { value: 'adverb', label: 'Adverb', description: 'Describes a verb or adjective' },
    { value: 'preposition', label: 'Preposition', description: 'Shows position or time' },
    { value: 'conjunction', label: 'Conjunction', description: 'Connects words or clauses' },
    { value: 'interjection', label: 'Interjection', description: 'Expresses emotion' },
  ];

  const isVerb = form.partOfSpeech === 'verb';

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    if (field === 'image') {
      setForm((prev) => ({
        ...prev,
        image: value,
        imagePreview: value ? URL.createObjectURL(value) : null,
      }));
      setImageError('');
    } else if (field === 'partOfSpeech') {
      setForm((prev) => ({
        ...prev,
        partOfSpeech: value,
        ...(value !== 'verb' ? { pastTense: '', futureTense: '' } : {}),
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && form.tagInput.trim()) {
      e.preventDefault();
      const tag = form.tagInput.trim();
      if (!form.tags.includes(tag)) {
        setForm((prev) => ({
          ...prev,
          tags: [...prev.tags, tag],
          tagInput: '',
        }));
      }
    }
  };

  const handleRemoveTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleAiAssist = (field) => async () => {
    // Placeholder - AI integration later
    console.log('AI assist for', field);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    if (field === 'example') {
      setForm((prev) => ({
        ...prev,
        example: prev.example ? `${prev.example} (AI: grammar checked)` : 'AI will correct your sentence.',
      }));
    } else if (field === 'pronunciation') {
      setForm((prev) => ({
        ...prev,
        pronunciation: prev.word ? `/ˈ${prev.word.toLowerCase()}ˈ/` : '/ˈexampleˈ/',
      }));
    } else if (field === 'pastTense') {
      setForm((prev) => ({
        ...prev,
        pastTense: prev.word ? `${prev.word}ed` : 'past form',
      }));
    } else if (field === 'futureTense') {
      setForm((prev) => ({
        ...prev,
        futureTense: prev.word ? `will ${prev.word}` : 'will + base form',
      }));
    }
  };

  const { data: slots = {} } = useQuery({
    queryKey: ['slots'],
    queryFn: getSlots,
  });
  const { available = 0, total = 5 } = slots;
  const canAdd = available > 0;

  const createMutation = useMutation({
    mutationFn: createVocabulary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabularies'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      navigate('/home');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setImageError('');
    if (!canAdd) {
      return;
    }
    if (!form.image) {
      setImageError('Image is required');
      return;
    }
    const fd = new FormData();
    fd.append('word', form.word.trim());
    fd.append('meaning', form.meaning.trim());
    fd.append('example', form.example.trim());
    fd.append('partOfSpeech', form.partOfSpeech);
    fd.append('pronunciation', form.pronunciation);
    fd.append('pastTense', form.pastTense);
    fd.append('futureTense', form.futureTense);
    fd.append('tags', form.tags.join(','));
    fd.append('image', form.image);
    createMutation.mutate(fd);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 2, px: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/home')} color="inherit">
          Back
        </Button>
      </Box>

      <Box sx={{ maxWidth: 640, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Add vocabulary
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Save new words with examples. AI buttons will help with correction and generation.
        </Typography>
        <Typography variant="body2" color="primary.main" fontWeight="medium" sx={{ mb: 3 }}>
          {canAdd ? (
            <>
              {available}/{total} slots left today
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                {(slots.streak || 0) >= 3 ? (
                  <LocalFireDepartment sx={{ fontSize: 18, color: 'warning.main' }} />
                ) : (
                  <LocalFireDepartmentOutlined sx={{ fontSize: 18, color: 'grey.400' }} />
                )}
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    color: (slots.streak || 0) >= 3 ? 'warning.main' : 'text.disabled',
                  }}
                >
                  {slots.streak ?? 0}d streak
                  {(slots.streakBonus || 0) > 0 && ` (+${slots.streakBonus} bonus)`}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              No slots left.{' '}
              <Button
                variant="text"
                size="small"
                sx={{ p: 0, minWidth: 0, textTransform: 'none', fontSize: 'inherit', fontWeight: 'inherit' }}
                onClick={() => navigate('/review')}
              >
                Complete a review to unlock more
              </Button>
            </>
          )}
        </Typography>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              {/* Word - required */}
              <TextField
                fullWidth
                label="Word"
                placeholder="e.g. accomplish"
                value={form.word}
                onChange={handleChange('word')}
                required
                sx={{ mb: 2 }}
              />

              {/* Meaning - required */}
              <TextField
                fullWidth
                label="Meaning"
                placeholder="e.g. to succeed in doing something"
                value={form.meaning}
                onChange={handleChange('meaning')}
                required
                sx={{ mb: 2 }}
              />

              {/* Part of speech */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="part-of-speech-label">Part of speech</InputLabel>
                <Select
                  labelId="part-of-speech-label"
                  label="Part of speech"
                  value={form.partOfSpeech}
                  onChange={handleChange('partOfSpeech')}
                >
                  {PART_OF_SPEECH_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Box sx={{ py: 0.5 }}>
                        <Typography variant="body1">{opt.label}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {opt.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Example - required, AI for correction */}
              <Box sx={{ mb: 2, position: 'relative' }}>
                <TextField
                  fullWidth
                  label="Example sentence"
                  placeholder="e.g. I accomplished my goal last year."
                  value={form.example}
                  onChange={handleChange('example')}
                  required
                  multiline
                  rows={2}
                  InputProps={{
                    sx: { pr: 6 },
                  }}
                />
                <Box sx={{ position: 'absolute', top: 36, right: 8 }}>
                  <AiAssistButton
                    onClick={handleAiAssist('example')}
                    aria-label="AI: fix grammar and improve sentence"
                  />
                </Box>
              </Box>

              {/* Image - required */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Image *
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{
                    py: 2,
                    borderStyle: 'dashed',
                    borderColor: imageError ? 'error.main' : 'divider',
                  }}
                >
                  {form.image ? form.image.name : 'Upload image'}
                  <input type="file" hidden accept="image/*" onChange={handleChange('image')} />
                </Button>
                {imageError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {imageError}
                  </Typography>
                )}
                {form.imagePreview && (
                  <Box sx={{ mt: 1, position: 'relative', display: 'inline-block' }}>
                    <Box
                      component="img"
                      src={form.imagePreview}
                      alt="Preview"
                      sx={{ maxHeight: 120, borderRadius: 1, border: 1, borderColor: 'divider' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => setForm((p) => ({ ...p, image: null, imagePreview: null }))}
                      sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {/* Tags - required */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Tags"
                  placeholder="e.g. verb, business (press Enter to add)"
                  value={form.tagInput}
                  onChange={handleChange('tagInput')}
                  onKeyDown={handleAddTag}
                  required={form.tags.length === 0}
                  helperText="Press Enter to add each tag"
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {form.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              {/* Optional section */}
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
                Optional
              </Typography>

              {/* Pronunciation - optional, AI */}
              <TextField
                fullWidth
                label="Pronunciation"
                placeholder="e.g. /əˈkɒmplɪʃ/"
                value={form.pronunciation}
                onChange={handleChange('pronunciation')}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AiAssistButton
                        onClick={handleAiAssist('pronunciation')}
                        aria-label="AI: generate IPA pronunciation"
                      />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Past tense - only for Verb */}
              {isVerb && (
                <TextField
                  fullWidth
                  label="Past tense"
                  placeholder="e.g. accomplished"
                  value={form.pastTense}
                  onChange={handleChange('pastTense')}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AiAssistButton
                          onClick={handleAiAssist('pastTense')}
                          aria-label="AI: conjugate past tense"
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              {/* Future tense - only for Verb */}
              {isVerb && (
                <TextField
                  fullWidth
                  label="Future tense"
                  placeholder="e.g. will accomplish"
                  value={form.futureTense}
                  onChange={handleChange('futureTense')}
                  sx={{ mb: 3 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AiAssistButton
                          onClick={handleAiAssist('futureTense')}
                          aria-label="AI: conjugate future tense"
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              {!isVerb && <Box sx={{ mb: 3 }} />}

              {createMutation.isError && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {createMutation.error?.response?.data?.message || 'Failed to save'}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={createMutation.isPending || !canAdd}
              >
                {createMutation.isPending ? 'Saving...' : 'Save vocabulary'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
